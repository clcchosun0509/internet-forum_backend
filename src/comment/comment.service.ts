import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createPaginationObject } from 'nestjs-typeorm-paginate';
import { FindOptionsRelations, Repository } from 'typeorm';
import { User } from '../entities';
import { Comment } from '../entities/comment.entity';
import { PostService } from '../post/post.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreateReplyCommentDto } from './dtos/create-reply-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { checkIsValidAndAuthorized } from './utils/service-helper';
import * as _ from 'lodash';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    private readonly postService: PostService,
  ) {}

  async getCommentsByPostId(page: number, limit: number, postId: number) {
    const comments = await this.commentRepo
      .createQueryBuilder('comment')
      .where('comment.post_id = :postId', { postId })
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.parentComment', 'parentComment')
      .leftJoinAndSelect('parentComment.author', 'parentCommentAuthor')
      .orderBy('comment.created_at', 'ASC')
      .withDeleted()
      .getMany();

    const sortedComments = this.sortComments(comments);

    const items = sortedComments.slice((page - 1) * limit, page * limit);
    const totalItems = sortedComments.length;

    return createPaginationObject({
      items,
      totalItems,
      currentPage: page,
      limit,
    });
  }

  findOneById(id: string, relations?: FindOptionsRelations<Comment>) {
    return this.commentRepo.findOne({
      where: { id },
      relations,
    });
  }

  async createComment(createCommentDto: CreateCommentDto, author: User) {
    const post = await this.postService.findOneById(createCommentDto.postId);
    if (!post) {
      throw new NotFoundException('해당 게시물이 존재하지 않습니다.');
    }

    const comment = this.commentRepo.create({
      content: createCommentDto.content,
      postId: post.id,
      authorId: author.id,
    });
    return this.commentRepo.save(comment);
  }

  async createReplyComment(
    createReplyCommentDto: CreateReplyCommentDto,
    author: User,
  ) {
    const parentComment = await this.commentRepo.findOne({
      where: { id: createReplyCommentDto.commentId },
      relations: { author: true },
    });

    if (!parentComment) {
      throw new NotFoundException('해당 댓글이 존재하지 않습니다.');
    }

    const comment = await this.commentRepo.create({
      content: createReplyCommentDto.content,
      postId: parentComment.postId,
      authorId: author.id,
      parentComment: { id: parentComment.id },
    });

    return await this.commentRepo.save(comment);
  }

  async updateComment(
    id: string,
    user: User,
    updateCommentDto: UpdateCommentDto,
  ) {
    const foundComment = await this.findOneById(id);
    checkIsValidAndAuthorized(foundComment, user);

    return this.commentRepo.save({ ...foundComment, ...updateCommentDto });
  }

  async deleteComment(id: string, user: User) {
    const foundComment = await this.findOneById(id);
    checkIsValidAndAuthorized(foundComment, user);

    return await this.commentRepo.softDelete({ id });
  }

  private sortComments(comments: Comment[]) {

    // 기존에는 댓글과 대댓글이 따로따로 있는데,
    // 댓글 밑에 대댓글이 오도록 순서를 바꿔준다.
    const firstSortedComments: Comment[] = [];
    for (const comment of comments) {
      if (!comment.parentCommentId) {
        firstSortedComments.push(comment);
        continue;
      }
      const parentIndex = firstSortedComments.findIndex(
        (parentComment) => parentComment.id === comment.parentCommentId,
      );

      firstSortedComments.splice(parentIndex + 1, 0, comment);
    }

    // 대댓글의 순서를 생성날짜순으로 정렬한다.
    const replyCommentItems: Record<string, Comment[]> = {};
    let replyCommentsPosition = -1;
    const parentCommentItems = firstSortedComments.filter((comment) => {
      if (!comment.parentCommentId) {
        replyCommentsPosition++;
        return true;
      }
      if (replyCommentItems[replyCommentsPosition]) {
        replyCommentItems[replyCommentsPosition].push(comment);
      } else {
        replyCommentItems[replyCommentsPosition] = [comment];
      }
      return false;
    });
    const sortedReplyCommentItems = _.mapValues(
      replyCommentItems,
      (comments) => {
        return comments.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
      },
    );

    // 댓글과 순서가 정렬된 대댓글을 하나로 합쳐준다.
    const result: Comment[] = [];
    parentCommentItems.forEach((comment, index) => {
      result.push(comment);
      if (sortedReplyCommentItems[index]) {
        result.push(...sortedReplyCommentItems[index]);
      }
    });

    return result;
  }
}

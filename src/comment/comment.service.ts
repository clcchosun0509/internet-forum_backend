import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createPaginationObject } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { Comment } from '../entities/comment.entity';
import { PostService } from '../post/post.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreateReplyCommentDto } from './dtos/create-reply-comment.dto';

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
      .getMany();
      
    const sortedComments: Comment[] = [];
    const orphanComments: Comment[] = [];
    for (const comment of comments) {
      if (!comment.parentCommentId) {
        sortedComments.push(comment);
        continue;
      }
      const parentIndex = sortedComments.findIndex(
        (parentComment) => parentComment.id === comment.parentCommentId,
      );
      if (parentIndex === -1) {
        orphanComments.push(comment);
        continue;
      }
      sortedComments.splice(parentIndex + 1, 0, comment);
    }
    const concatedComments = [...orphanComments, ...sortedComments];

    const items = concatedComments.slice((page - 1) * limit, page * limit);
    const totalItems = concatedComments.length;

    return createPaginationObject({
      items,
      totalItems,
      currentPage: page,
      limit,
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
}

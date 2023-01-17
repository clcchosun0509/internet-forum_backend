import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { DataSource, In, Repository } from 'typeorm';
import { Post, PostLike, User } from '../entities';
import { BoardId } from '../entities/board-id.type';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { checkIsValidAndAuthorized } from './utils/service-helper';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(PostLike) private postLikeRepo: Repository<PostLike>,
    private dataSource: DataSource,
  ) {}

  create(createPostDto: CreatePostDto, author: User) {
    const { title, content, boardId } = createPostDto;
    const post = this.postRepo.create({ title, content, boardId, author });
    return this.postRepo.save(post);
  }

  findOneById(id: number) {
    return this.postRepo.findOne({
      where: { id },
      relations: { author: true },
    });
  }

  async increaseViewCountById(id: number) {
    await this.postRepo.increment({ id }, 'viewCount', 1);
    return true;
  }

  async updatePost(id: number, user: User, updatePostDto: UpdatePostDto) {
    const foundPost = await this.findOneById(id);
    checkIsValidAndAuthorized(foundPost, user);

    const { title, content } = updatePostDto;
    await this.postRepo.update({ id }, { title, content });
    return await this.findOneById(id);
  }

  async deletePost(id: number, user: User) {
    const foundPost = await this.findOneById(id);
    checkIsValidAndAuthorized(foundPost, user);

    return await this.postRepo.softDelete({ id });
  }

  getPostsByBoardId(page: number, limit: number, boardId: BoardId) {
    return paginate(
      this.postRepo,
      { page, limit },
      {
        where: {
          boardId,
        },
        relations: ['author'],
        order: { createdAt: 'DESC' },
      },
    );
  }

  getPostsByPostIds(postIds: number[]) {
    return this.postRepo.find({
      where: { id: In(postIds) },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async likePost(id: number, user: User) {
    let postLike = await this.postLikeRepo.findOne({
      where: { postId: id, userId: user.id },
    });

    if (postLike) {
      throw new BadRequestException('이미 추천을 하셨습니다.');
    }

    const post = await this.findOneById(id);
    if (!post) {
      throw new NotFoundException('해당 게시물이 존재하지 않습니다.');
    }
    postLike = this.postLikeRepo.create({ postId: id, userId: user.id });
    post.likeCount++;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.getRepository(Post).save(post);
      await queryRunner.manager.getRepository(PostLike).save(postLike);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

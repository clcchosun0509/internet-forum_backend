import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Post, User } from '../entities';
import { BoardId } from '../entities/board-id.type';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { checkIsValidAndAuthorized } from './utils/service-helper';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private repo: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto, author: User) {
    const { title, content, boardId } = createPostDto;
    const post = this.repo.create({ title, content, boardId, author });
    return this.repo.save(post);
  }

  findOneById(id: number) {
    return this.repo.findOne({ where: { id }, relations: { author: true } });
  }

  async increaseViewCountById(id: number) {
    await this.repo.increment({ id }, 'viewCount', 1);
    return true;
  }

  async updatePost(id: number, user: User, updatePostDto: UpdatePostDto) {
    const foundPost = await this.findOneById(id);
    checkIsValidAndAuthorized(foundPost, user);

    const { title, content } = updatePostDto;
    await this.repo.update({ id }, { title, content });
    return await this.findOneById(id);
  }

  async deletePost(id: number, user: User) {
    const foundPost = await this.findOneById(id);
    checkIsValidAndAuthorized(foundPost, user);

    return await this.repo.softDelete({ id });
  }

  getPostsByBoardId(page: number, limit: number, boardId: BoardId) {
    return paginate(
      this.repo,
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
}

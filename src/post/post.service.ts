import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Post, User } from '../entities';
import { BoardId } from '../entities/board-id.type';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

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

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    const { title, content } = updatePostDto;
    const post: Post = (await this.repo.update({ id }, { title, content }))
      .raw?.[0];
    return post;
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

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, PostLike } from '../entities';
import { PostLikeController } from './post-like.controller';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostLike])],
  controllers: [PostController, PostLikeController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}

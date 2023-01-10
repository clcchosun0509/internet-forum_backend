import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities';
import { PostModule } from '../post/post.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), PostModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}

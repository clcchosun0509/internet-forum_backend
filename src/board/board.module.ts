import { Module } from '@nestjs/common';
import { PostModule } from '../post/post.module';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [PostModule],
  controllers: [BoardController],
  providers: [BoardService]
})
export class BoardModule {}

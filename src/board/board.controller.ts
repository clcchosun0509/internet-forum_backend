import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { BoardId } from '../entities/board-id.type';
import { PostService } from '../post/post.service';
import { ParseBoardIdPipe } from './parse-board-id.pipe';

@Controller('board')
export class BoardController {
  constructor(private readonly postService: PostService) {}

  @Get('/:id')
  getPosts(
    @Param('id', ParseBoardIdPipe) id: BoardId,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.postService.getPostsByBoardId(page, 20, id);
  }
}

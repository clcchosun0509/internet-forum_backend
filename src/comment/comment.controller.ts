import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { Role } from '../auth/decorators/role.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User, UserRole } from '../entities/user.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreateReplyCommentDto } from './dtos/create-reply-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getCommentsByPostId(
    @Query('postId', ParseIntPipe) postId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.commentService.getCommentsByPostId(page, 10, postId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Role(UserRole.USER)
  async createComment(@AuthUser() user: User, @Body() body: CreateCommentDto) {
    const comment = await this.commentService.createComment(body, user);
    return comment;
  }

  @Post('/reply')
  @UseGuards(AuthGuard)
  @Role(UserRole.USER)
  async createReplyComment(
    @AuthUser() user: User,
    @Body() body: CreateReplyCommentDto,
  ) {
    const comment = await this.commentService.createReplyComment(body, user);
    return comment;
  }
}

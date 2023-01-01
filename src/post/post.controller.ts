import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { Role } from '../auth/decorators/role.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../entities';
import { UserRole } from '../entities/user.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Role(UserRole.USER)
  async createPost(@AuthUser() user: User, @Body() body: CreatePostDto) {
    const post = await this.postService.create(body, user);
    return post;
  }

  @Get('/:id')
  async getPost(@Param('id', ParseIntPipe) id: number) {
    await this.postService.increaseViewCountById(id);
    return this.postService.findOneById(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  @Role(UserRole.USER)
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: User,
    @Body() body: UpdatePostDto,
  ) {
    const foundPost = await this.postService.findOneById(id);
    
    const isAdmin = user.roles.includes(UserRole.ADMIN);
    if (!isAdmin && user.id !== foundPost.authorId) {
      throw new UnauthorizedException('게시글 작성자가 아닙니다.');
    }

    return await this.postService.updatePost(id, body);
  }
}

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { Role } from '../auth/decorators/role.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User, UserRole } from '../entities/user.entity';
import { CreatePostLikeDto } from './dtos/create-post-like.dto';
import { PostService } from './post.service';

@Controller('like')
export class PostLikeController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Role(UserRole.USER)
  async likePost(@AuthUser() user: User, @Body() body: CreatePostLikeDto) {
    await this.postService.likePost(body.postId, user);
    return { status: true };
  }
}

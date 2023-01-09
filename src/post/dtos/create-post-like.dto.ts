import { IsNumber } from 'class-validator';

export class CreatePostLikeDto {
  @IsNumber()
  postId: number;
}

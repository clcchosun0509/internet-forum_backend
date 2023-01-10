import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  postId: number;

  @IsString()
  @MaxLength(1000)
  content: string;
}

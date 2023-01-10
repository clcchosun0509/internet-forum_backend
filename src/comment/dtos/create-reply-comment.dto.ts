import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateReplyCommentDto {
  @IsString()
  commentId: string;

  @IsString()
  @MaxLength(1000)
  content: string;
}

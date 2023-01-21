import { IsString, MaxLength } from "class-validator";

export class UpdateCommentDto {
  @IsString()
  @MaxLength(1000)
  content: string;
}
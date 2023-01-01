import { IsEnum, IsString, MaxLength } from 'class-validator';
import { BoardId } from '../../entities/board-id.type';

export class CreatePostDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @MaxLength(65535)
  content: string;

  @IsEnum(BoardId)
  boardId: BoardId;
}

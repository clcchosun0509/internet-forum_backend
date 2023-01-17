import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { BoardId } from "../../entities/board-id.type";

export class SearchQueryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  query: string;

  @IsEnum(BoardId)
  boardId: BoardId;

  @Type(() => Number)
  @IsNumber()
  page: number;
}
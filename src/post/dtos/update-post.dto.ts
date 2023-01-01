import { IsNumber, IsString, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsString()
  @MaxLength(65535)
  content: string;
}

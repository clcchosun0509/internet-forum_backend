import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { BoardId, BoardIds } from '../entities/board-id.type';

@Injectable()
export class ParseBoardIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!BoardIds.includes(value)) {
      throw new BadRequestException(`${value} is not valid board id`);
    }
    return value as BoardId;
  }
}

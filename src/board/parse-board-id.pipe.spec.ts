import { ParseBoardIdPipe } from './parse-board-id.pipe';
import { BoardIds } from '../entities/board-id.type';
import { BadRequestException } from '@nestjs/common';

describe('ParseBoardIdPipe', () => {
  let pipe: ParseBoardIdPipe;

  beforeEach(() => {
    pipe = new ParseBoardIdPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return the value if it is a valid board id', () => {
    for (const id of BoardIds) {
      expect(pipe.transform(id, null)).toEqual(id);
    }
  });

  it('should throw a BadRequestException if the value is not a valid board id', () => {
    expect(() => pipe.transform('invalid', null)).toThrow(BadRequestException);
  });
});

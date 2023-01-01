import { Column } from 'typeorm';
import { ColumnCommonOptions } from 'typeorm/decorator/options/ColumnCommonOptions';
import { BoardId } from '../board-id.type';

export const BoardIdColumn = (option: ColumnCommonOptions = {}) =>
  Column('enum', {
    ...option,
    enum: BoardId,
  });

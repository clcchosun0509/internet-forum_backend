import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardId } from './board-id.type';
import { User } from './user.entity';
import { BoardIdColumn } from './utils/board-id-column.decorator';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column({ name: 'author_id' })
  authorId: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: User;

  @Column()
  content: string;

  @BoardIdColumn({ name: 'board_id' })
  boardId: BoardId;

  @Column('int', { name: 'view_count' })
  viewCount = 0;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}

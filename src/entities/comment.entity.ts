import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column({ name: 'post_id' })
  postId: number;

  @ManyToOne(() => Post, (post) => post.comments, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;

  @Column({ name: 'author_id' })
  authorId: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: User;

  @Column({ name: 'parent_comment_id', nullable: true })
  parentCommentId: string | null;

  @ManyToOne(() => Comment, (comment) => comment.childComments, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_comment_id', referencedColumnName: 'id' })
  parentComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  childComments: Comment[] | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}

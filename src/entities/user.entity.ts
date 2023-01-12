import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostLike } from './post-like.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export const UserRoles = [UserRole.USER, UserRole.ADMIN];

@Entity()
export class User {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column()
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.USER],
  })
  roles: UserRole[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => PostLike, (postLike) => postLike.user)
  postLikes: PostLike[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}

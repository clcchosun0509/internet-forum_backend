import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
export class PostLike {
  @Column('int', { name: 'post_id', primary: true })
  postId: number;

  @ManyToOne(() => Post, (post) => post.likes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;

  @Column({ name: 'user_id', primary: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.postLikes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

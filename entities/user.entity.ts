import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  no: number;

  @PrimaryColumn({ unique: true })
  id: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  nickname: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [],
  })
  roles: UserRole[];
}

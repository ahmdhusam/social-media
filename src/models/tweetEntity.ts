import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany
} from 'typeorm';
import { User } from './userEntity';

@Entity({ name: 'tweets' })
export class Tweet extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 141 })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Tweet, tweet => tweet.replys, { onDelete: 'CASCADE', lazy: true })
  parent: Promise<Tweet>;

  @ManyToOne(() => User, user => user.tweets, { onDelete: 'CASCADE', nullable: false, lazy: true })
  creator: Promise<User>;

  @ManyToMany(() => User, user => user.likes, { onDelete: 'CASCADE', lazy: true })
  likedBy: Promise<User[]>;

  @OneToMany(() => Tweet, tweet => tweet.parent, { lazy: true })
  replys: Promise<Tweet[]>;
}

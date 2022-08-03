import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { User } from './userEntity';

@Entity({ name: 'tweets' })
export class Tweet extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 141 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Tweet, tweet => tweet.replys, { onDelete: 'CASCADE' })
  parent: Tweet;

  @OneToMany(() => Tweet, tweet => tweet.parent)
  replys: Tweet[];

  @ManyToOne(() => User, user => user.tweets, { onDelete: 'CASCADE' })
  creator: User;
}

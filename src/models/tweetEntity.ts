import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn
} from 'typeorm';
import { TweetImages } from './tweet-images.model';
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
  @JoinColumn({ name: 'creator_id' })
  creator: Promise<User>;

  @ManyToMany(() => User, user => user.likes, { onDelete: 'CASCADE', lazy: true })
  likedBy: Promise<User[]>;

  @ManyToMany(() => User, user => user.retweets, { onDelete: 'CASCADE', lazy: true })
  retweetedBy: Promise<User[]>;

  @OneToMany(() => Tweet, tweet => tweet.parent, { lazy: true })
  replys: Promise<Tweet[]>;

  @OneToMany(() => TweetImages, tweetImages => tweetImages.tweet, { eager: true })
  images: TweetImages[];
}

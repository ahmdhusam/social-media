import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Tweet } from './tweetEntity';

export enum Gender {
  Male = 'male',
  Female = 'female'
}

@Check(`
  "birth_date"
  BETWEEN
  (CURRENT_DATE - interval '120 year')
  AND
  (CURRENT_DATE - interval '18 year') 
`)
@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, name: 'user_name', length: 40 })
  userName: string;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ length: 100, default: '' })
  bio: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ default: '/images/avatar.png' })
  avatar: string;

  @Column({ default: '' })
  header: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ length: 61 })
  password: string;

  @OneToMany(() => Tweet, tweet => tweet.creator, { lazy: true })
  tweets: Promise<Tweet[]>;

  @ManyToMany(() => Tweet, tweet => tweet.likedBy, { onDelete: 'CASCADE', lazy: true })
  @JoinTable()
  likes: Promise<Tweet[]>;

  @ManyToMany(() => User, user => user.followings, { onDelete: 'CASCADE', lazy: true })
  followers: Promise<User[]>;

  @ManyToMany(() => User, user => user.followers, { onDelete: 'CASCADE', lazy: true })
  @JoinTable({ joinColumn: { name: 'follower_id' }, inverseJoinColumn: { name: 'following_id' } })
  followings: Promise<User[]>;
}

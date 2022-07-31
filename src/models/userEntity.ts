import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Check
} from 'typeorm';
import { Follow } from './followEntity';
import { Tweet } from './tweetEntity';

export enum Gender {
  Male = 'male',
  Female = 'female'
}

@Check(`
  "birth_date" < (CURRENT_DATE - interval '18 year -1 day') 
AND
  "birth_date" > (CURRENT_DATE - interval '120 year 1 day')
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

  @Column({ nullable: true })
  header: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ length: 61 })
  password: string;

  @OneToMany(() => Tweet, tweet => tweet.creator)
  tweets: Tweet[];

  @OneToMany(() => Follow, follow => follow.following)
  followers: Follow;

  @OneToMany(() => Follow, follow => follow.follower)
  followings: Follow;
}

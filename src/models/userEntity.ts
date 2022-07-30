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

@Check(`"birth_date" < (CURRENT_DATE - interval '18 year -1 day')`)
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

  @Column({ length: 61 })
  password: string;

  @Column({ length: 100, default: '' })
  bio: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ default: '' })
  avatar: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Tweet, tweet => tweet.creator)
  tweets: Tweet[];

  @OneToMany(() => Follow, follow => follow.follower)
  followers: Follow;

  @OneToMany(() => Follow, follow => follow.following)
  followings: Follow;
}

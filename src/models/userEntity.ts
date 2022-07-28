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
import { Tweet } from './tweetEntity';

@Check(`"birth_date" < (now() - interval '18 year')`)
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

  @Column({ name: 'birth_date' })
  birthDate: Date;

  @Column({ default: '' })
  avatar: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Tweet, tweet => tweet.creator)
  tweets: Tweet[];
}

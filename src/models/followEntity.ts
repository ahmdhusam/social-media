import { Entity, BaseEntity, PrimaryColumn, CreateDateColumn, ManyToOne, JoinTable, Check } from 'typeorm';
import { User } from '.';

@Check('"followerId" <> "followingId"')
@Entity({ name: 'follows' })
export class Follow extends BaseEntity {
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @PrimaryColumn({ type: 'uuid', name: 'followerId' })
  @ManyToOne(() => User, user => user.followings, { onDelete: 'CASCADE' })
  @JoinTable()
  follower: User;

  @PrimaryColumn({ type: 'uuid', name: 'followingId' })
  @ManyToOne(() => User, user => user.followers, { onDelete: 'CASCADE' })
  @JoinTable()
  following: User;
}

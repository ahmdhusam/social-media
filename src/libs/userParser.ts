import type { IUser } from '../types';
import { User } from '../models';

export function parseUser(user: User): IUser {
  return {
    ...user,
    tweets: () => user.tweets,
    likes: () => user.likes,
    retweets: () => user.retweets,
    followings: () => user.followings,
    followers: () => user.followers
  };
}

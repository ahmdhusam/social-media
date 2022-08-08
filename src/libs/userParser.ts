import type { GetUsers, GetUser, IUser } from '../types';
import { In } from 'typeorm';
import { User } from '../models';

export function parseUser(user: User): IUser {
  return {
    ...user,
    tweets: () => user.tweets,
    likes: () => user.likes,
    followings: () => user.followings,
    followers: () => user.followers
  };
}

export const getUser: GetUser = async (userId: string) => {
  const user = await User.findOneByOrFail({ id: userId });

  return parseUser(user);
};

export const getUsers: GetUsers = async (usersId: string[]) => {
  const users = await User.findBy({ id: In(usersId) });

  return users.map(parseUser);
};

import type { GetUsers, GetUser, IUser } from '../types';
import { In } from 'typeorm';
import { User } from '../models';
import { getTweets } from '.';

export function parseUser(user: User): IUser {
  return {
    ...user,
    tweets: getTweets.bind(
      null,
      user.tweets.slice(0, 20).map(tweet => tweet.id)
    ),
    likes: getTweets.bind(
      null,
      user.likes.slice(0, 20).map(tweet => tweet.id)
    ),
    followings: getUsers.bind(
      null,
      user.followings.slice(0, 20).map(follow => follow.following.toString())
    ),
    followers: getUsers.bind(
      null,
      user.followers.slice(0, 20).map(follow => follow.follower.toString())
    )
  };
}

export const getUser: GetUser = async (userId: string) => {
  const user = await User.findOne({
    where: {
      id: userId
    },
    relations: ['tweets', 'followings', 'followers', 'likes'],
    select: {
      password: false,
      tweets: {
        id: true
      },
      likes: {
        id: true
      },
      followings: {
        following: {
          id: true
        }
      },
      followers: {
        follower: {
          id: true
        }
      }
    }
  });

  return parseUser(user);
};

export const getUsers: GetUsers = async (usersId: string[]) => {
  const users = await User.find({
    where: {
      id: In(usersId)
    },
    relations: ['tweets', 'followings', 'followers', 'likes'],
    select: {
      password: false,
      tweets: {
        id: true
      },
      likes: {
        id: true
      },
      followings: {
        following: {
          id: true
        }
      },
      followers: {
        follower: {
          id: true
        }
      }
    }
  });
  return users.map(parseUser);
};

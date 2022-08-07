import type { GetTweet, GetTweets, ITweet } from '../types';
import { In } from 'typeorm';
import { Tweet } from '../models';
import { getUser, getUsers } from '.';

export const parseTweet = (tweet: Tweet): ITweet => {
  return {
    ...tweet,
    creator: getUser.bind(null, tweet.creator.id),
    likedBy: getUsers.bind(
      null,
      tweet.likedBy.slice(0, 20).map(user => user.id)
    ),
    replys: getTweets.bind(
      null,
      tweet.replys.slice(0, 20).map(tweet => tweet.id)
    )
  };
};

export const getTweet: GetTweet = async (tweetId: string): Promise<ITweet> => {
  const getTweet = await Tweet.findOne({
    where: { id: tweetId },
    relations: ['creator', 'replys', 'likedBy'],
    select: {
      creator: {
        id: true
      },
      likedBy: {
        id: true
      },
      replys: {
        id: true
      }
    }
  });

  return parseTweet(getTweet);
};

export const getTweets: GetTweets = async (tweetsId: string[]) => {
  const tweets = await Tweet.find({
    where: { id: In(tweetsId) },
    relations: ['creator', 'replys', 'likedBy'],
    select: {
      creator: {
        id: true
      },
      likedBy: {
        id: true
      },
      replys: {
        id: true
      }
    }
  });

  return tweets.map(parseTweet);
};

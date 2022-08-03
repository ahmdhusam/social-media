import type { GetTweet, GetTweets, ITweet } from '../types';
import { In } from 'typeorm';
import { Tweet } from '../models';
import { getUser } from '.';

export const parseTweet = (tweet: Tweet): ITweet => {
  return {
    ...tweet,
    replys: getTweets.bind(
      null,
      tweet.replys.slice(0, 20).map(tweet => tweet.id)
    ),
    creator: getUser.bind(null, tweet.creator.id)
  };
};

export const getTweet: GetTweet = async (tweetId: string): Promise<ITweet> => {
  const getTweet = await Tweet.findOne({
    where: { id: tweetId },
    relations: ['creator', 'replys'],
    select: {
      replys: {
        id: true
      },
      creator: {
        id: true
      }
    }
  });

  return parseTweet(getTweet);
};

export const getTweets: GetTweets = async (tweetsId: string[]) => {
  const tweets = await Tweet.find({
    where: { id: In(tweetsId) },
    relations: ['creator', 'replys'],
    select: {
      replys: {
        id: true
      },
      creator: {
        id: true
      }
    }
  });

  return tweets.map(parseTweet);
};

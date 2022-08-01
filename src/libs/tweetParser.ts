import type { GetTweets, ITweet } from '../types';
import { In } from 'typeorm';
import { Tweet } from '../models';
import { getUser } from '.';

export const parseTweet = (tweet: Tweet): ITweet => {
  return {
    ...tweet,
    creator: getUser.bind(null, tweet.creator.id)
  };
};

export const getTweets: GetTweets = async (tweetsId: string[]) => {
  const tweets = await Tweet.find({
    where: { id: In(tweetsId) },
    relations: ['creator'],
    select: {
      creator: {
        id: true
      }
    }
  });

  return tweets.map(parseTweet);
};

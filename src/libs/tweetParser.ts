import type { ITweet } from '../types';
import { Tweet } from '../models';

export const parseTweet = (tweet: Tweet): ITweet => {
  return {
    ...tweet,
    creator: () => tweet.creator,
    likedBy: () => tweet.likedBy,
    retweetedBy: () => tweet.retweetedBy,
    replys: () => tweet.replys
  };
};

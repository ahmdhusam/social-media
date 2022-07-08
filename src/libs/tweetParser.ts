import type { GetTweets } from '../types';

import { TweetModel } from '../models';

import { getUser } from '.';

export const getTweets: GetTweets = async (tweetsId: string[]) => {
    const tweets = await TweetModel.find({ _id: { $in: tweetsId } });

    return tweets.map(parseTweet);
};

export const parseTweet = (tweet: any) => {
    return {
        ...tweet._doc,
        id: tweet.id,
        replys: getTweets.bind(null, tweet._doc.replys),
        creator: getUser.bind(null, tweet._doc.creator)
    };
};

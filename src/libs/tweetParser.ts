import type { GetTweets } from '../types';

import { TweetModel } from '../models';

import { getUser } from '.';

export const parseTweets: GetTweets = async (tweetsId: string[]) => {
    const tweets = await TweetModel.find({ _id: { $in: tweetsId } }).select('-_id');

    return tweets.map((tweet: any) => ({
        ...tweet._doc,
        id: tweet.id,
        replys: parseTweets.bind(null, tweet._doc.replys),
        creator: getUser.bind(null, tweet._doc.creator)
    }));
};

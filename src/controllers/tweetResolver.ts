import type { Request } from 'express';
import type { ITweet, ITweetInput, ITweetResolver, Req } from '../types';

import { TweetModel, UserModel } from '../models';

import { parseTweet, TweetValidate } from '../libs';

export default class TweetResolver implements ITweetResolver {
    private static instance: TweetResolver;

    static get getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }

    private constructor() {
        this.createTweet = this.createTweet;
        this.getTweet = this.getTweet;
        this.getTimeline = this.getTimeline;
    }

    async createTweet({ tweet }: { tweet: ITweetInput }, request: Request): Promise<ITweet> {
        const req: Req = <Req>request;
        if (!req.User.isValid) throw new Error('Not authenticated.');

        const user = await UserModel.findById(req.User.userId).select('-password');
        if (!user) throw new Error('User Not Found');

        const validTweet = await TweetValidate.validate(tweet);

        const newTweet = await new TweetModel({
            content: validTweet.content,
            creator: user
        }).save();

        user.tweets.push(newTweet.toObject());
        await user.save();

        return parseTweet(newTweet);
    }

    async getTweet({ tweetId }: { tweetId: string }, request: Request): Promise<ITweet> {
        const req: Req = <Req>request;
        if (!req.User.isValid) throw new Error('Not authenticated.');

        const tweet = await TweetModel.findById(tweetId);
        if (!tweet) throw new Error('Not Found 404');

        return parseTweet(tweet);
    }
    async getTimeline(_: any, request: Request): Promise<ITweet[]> {
        const { User }: Req = <Req>request;
        if (!User.isValid) throw new Error('Not authenticated.');

        const user = await UserModel.findById(User.userId);
        if (!user) throw new Error('User Not Found');

        const timelineTweets = await TweetModel.find({
            $or: [{ creator: { $in: user.following } }, { creator: user }]
        }).sort({ updatedAt: -1 });

        return timelineTweets.map(t => parseTweet(t));
    }
}

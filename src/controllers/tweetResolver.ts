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
    }

    async createTweet({ tweet }: { tweet: ITweetInput }, request: Request): Promise<ITweet> {
        const req: Req = <Req>request;
        if (!req.User.isValid) throw new Error('You are Not a valid user');

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
    async getTweet(): Promise<ITweet> {
        throw new Error('Method not implemented.');
    }
    async getTimeline(): Promise<ITweet[]> {
        throw new Error('Method not implemented.');
    }
}

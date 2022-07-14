import type { Request } from 'express';
import type { IReplyInput, ITweet, ITweetInput, ITweetResolver, Req } from '../types';

import { TweetModel, UserModel } from '../models';

import { parseTweet, TweetValidate, ReplyValidate } from '../libs';

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
        this.addReply = this.addReply;
        this.retweet = this.retweet;
        this.deleteTweet = this.deleteTweet;
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

    async addReply({ reply }: { reply: IReplyInput }, request: Request): Promise<ITweet[]> {
        const { User }: Req = <Req>request;
        if (!User.isValid) throw new Error('Not authenticated.');

        const valideReply = await ReplyValidate.validate(reply);

        const [user, parentTweet] = await Promise.all([
            UserModel.findById(User.userId),
            TweetModel.findById(valideReply.tweetId)
        ]);
        if (!user || !parentTweet) throw new Error('Not Found 404');

        const newReply = await new TweetModel({
            content: valideReply.content,
            creator: user
        }).save();

        user.tweets.push(newReply.id);
        parentTweet.replys.push(newReply.id);
        await Promise.all([user.save(), parentTweet.save()]);

        return parseTweet(parentTweet);
    }

    async retweet({ tweetId }: { tweetId: string }, request: Request): Promise<ITweet> {
        const { User }: Req = <Req>request;
        if (!User.isValid) throw new Error('Not authenticated.');

        const [user, tweet] = await Promise.all([
            UserModel.findById(User.userId).select('-password'),
            TweetModel.findById(tweetId)
        ]).catch(_ => {
            throw new Error('tweet id not valid');
        });
        if (!user || !tweet) throw new Error('Not Found 404');

        if (user.tweets.includes(tweet.id)) return parseTweet(tweet);

        user.tweets.push(tweet.id);
        await user.save();

        return parseTweet(tweet);
    }

    async deleteTweet(_ctx: { tweetId: string }, _request: Request): Promise<ITweet> {
        throw new Error('Method not implemented.');
    }
}

import type { Request } from 'express';
import type { IReplyInput, ITweet, ITweetInput, ITweetResolver, Req } from '../types';

import { join } from 'path';
import { fork } from 'child_process';

import { TweetModel } from '../models';

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
        const { User }: Req = <Req>request;
        if (!User) throw new Error('Not authenticated.');

        const validTweet = await TweetValidate.validate(tweet);

        const newTweet = await new TweetModel({
            content: validTweet.content,
            creator: User
        }).save();

        User.tweets.push(newTweet.toObject());
        await User.save();

        return parseTweet(newTweet);
    }

    async getTweet({ tweetId }: { tweetId: string }, request: Request): Promise<ITweet> {
        const { User }: Req = <Req>request;
        if (!User) throw new Error('Not authenticated.');

        const tweet = await TweetModel.findById(tweetId);
        if (!tweet) throw new Error('Not Found 404');

        return parseTweet(tweet);
    }

    async getTimeline(_: any, request: Request): Promise<ITweet[]> {
        const { User }: Req = <Req>request;
        if (!User) throw new Error('Not authenticated.');

        const timelineTweets = await TweetModel.find({
            $or: [{ creator: { $in: User.following } }, { creator: User }]
        }).sort({ updatedAt: -1 });

        return timelineTweets.map(t => parseTweet(t));
    }

    async addReply({ reply }: { reply: IReplyInput }, request: Request): Promise<ITweet[]> {
        const { User }: Req = <Req>request;
        if (!User) throw new Error('Not authenticated.');

        const validReply = await ReplyValidate.validate(reply);

        const parentTweet = await TweetModel.findById(validReply.tweetId);
        if (!parentTweet) throw new Error('tweet Not Found 404');

        const newReply = await new TweetModel({
            content: validReply.content,
            creator: User
        }).save();

        User.tweets.push(newReply.id);
        parentTweet.replys.push(newReply.id);
        await Promise.all([User.save(), parentTweet.save()]);

        return parseTweet(parentTweet);
    }

    async retweet({ tweetId }: { tweetId: string }, request: Request): Promise<ITweet> {
        const { User }: Req = <Req>request;
        if (!User) throw new Error('Not authenticated.');

        const tweet = await TweetModel.findById(tweetId).catch(_ => {
            throw new Error('tweet id not valid');
        });
        if (!tweet) throw new Error('Not Found 404');

        if (User.tweets.includes(tweet.id)) return parseTweet(tweet);

        User.tweets.push(tweet.id);
        await User.save();

        return parseTweet(tweet);
    }

    async deleteTweet({ tweetId }: { tweetId: string }, request: Request): Promise<ITweet> {
        const { User }: Req = <Req>request;
        if (!User) throw new Error('Not authenticated.');

        const tweet = await TweetModel.findById(tweetId).catch(_ => {
            throw new Error('tweet id Not Valid');
        });
        if (!tweet) throw new Error('Not Found 404');

        if (tweet.creator.toString() !== User.id) throw new Error('Not authorization');

        const deleteFork = fork(join(__dirname, '..', 'libs', 'deleteReplys.js'));
        deleteFork.send({ tweet });
        deleteFork.on('exit', async () => {
            await Promise.all([
                TweetModel.updateOne({ replys: tweet.id }, { $pull: { replys: tweet.id } }),
                tweet.delete()
            ]);
        });

        return parseTweet(tweet);
    }
}

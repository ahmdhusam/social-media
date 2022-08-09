import type { Request } from 'express';
import type { IReplyData, ITweet, ITweetData, ITweetResolver } from '../types';
import { In } from 'typeorm';
import { Tweet } from '../models';
import { TweetDataValidate, ReplyDataValidate, parseTweet } from '../libs';

export default class TweetResolver implements ITweetResolver {
  private static instance: TweetResolver;

  static get getInstance(): TweetResolver {
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
    this.like = this.like;
  }

  async createTweet({ tweet }: { tweet: ITweetData }, req: Request): Promise<ITweet> {
    if (!req.User) throw new Error('Not authenticated.');

    const validTweet = await TweetDataValidate.validate(tweet);

    const newTweet = new Tweet();
    Object.assign(newTweet, validTweet, { creator: req.User });

    await Tweet.save(newTweet);

    return parseTweet(newTweet);
  }

  async getTweet({ tweetId }: { tweetId: string }, req: Request): Promise<ITweet> {
    if (!req.User) throw new Error('Not authenticated.');

    const tweet = await Tweet.findOneByOrFail({ id: tweetId });
    if (!tweet) throw new Error('Not Found 404');

    return parseTweet(tweet);
  }

  async getTimeline(_: never, req: Request): Promise<ITweet[]> {
    if (!req.User) throw new Error('Not authenticated.');

    const followingsIds = (await req.User.followings).map(user => user.id);
    const timelineTweets = await Tweet.find({
      where: [{ creator: { id: req.User.id } }, { creator: { id: In(followingsIds) } }],
      order: { createdAt: 'DESC' },
      take: 20
    });

    return timelineTweets.map(tweet => parseTweet(tweet));
  }

  async addReply({ reply }: { reply: IReplyData }, req: Request): Promise<ITweet> {
    if (!req.User) throw new Error('Not authenticated.');

    const validReply = await ReplyDataValidate.validate(reply);

    const parentTweet = await Tweet.countBy({ id: validReply.tweetId });
    if (!parentTweet) throw new Error('Not Found 404');

    const newReply = new Tweet();
    Object.assign(newReply, { content: validReply.content, creator: req.User, parent: validReply.tweetId });
    await Tweet.save(newReply);

    return parseTweet(newReply);
  }

  retweet(_ctx: { tweetId: string }, _req: Request): Promise<ITweet> {
    throw new Error('Method not implemented.');
  }

  async deleteTweet({ tweetId }: { tweetId: string }, req: Request): Promise<ITweet> {
    if (!req.User) throw new Error('Not authenticated.');

    const tweet = await Tweet.findOneByOrFail({ id: tweetId, creator: { id: req.User.id } }).catch(_ => {
      throw new Error('tweet id Not Valid');
    });
    if (!tweet) throw new Error('Not Found 404');

    const ONE_SEC = 1000;
    setTimeout(() => {
      Tweet.delete({ id: tweetId });
    }, ONE_SEC);

    return parseTweet(tweet);
  }

  async like({ tweetId }: { tweetId: string }, req: Request): Promise<ITweet> {
    if (!req.User) throw new Error('Not authenticated.');

    const tweet = await Tweet.findOneByOrFail({ id: tweetId });
    if (!tweet) throw new Error('Not Found 404');

    (await req.User.likes).push(tweet);
    await req.User.save();

    return parseTweet(tweet);
  }
}

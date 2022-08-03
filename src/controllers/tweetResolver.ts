import type { Request } from 'express';
import type { IReplyData, ITweet, ITweetData, ITweetResolver } from '../types';
import { In } from 'typeorm';
import { Tweet, Follow } from '../models';
import { TweetDataValidate, getTweet, getTweets, ReplyDataValidate } from '../libs';

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
  }

  async createTweet({ tweet }: { tweet: ITweetData }, req: Request): Promise<ITweet> {
    if (!req.User) throw new Error('Not authenticated.');

    const validTweet = await TweetDataValidate.validate(tweet);

    const newTweet = new Tweet();
    Object.assign(newTweet, validTweet, { creator: req.User.id });

    await Tweet.save(newTweet);

    return getTweet(newTweet.id);
  }

  async getTweet({ tweetId }: { tweetId: string }, req: Request): Promise<ITweet> {
    if (!req.User) throw new Error('Not authenticated.');

    return getTweet(tweetId);
  }

  async getTimeline(_: never, req: Request): Promise<ITweet[]> {
    if (!req.User) throw new Error('Not authenticated.');

    const followings = (
      await Follow.find({
        select: { following: { id: true } },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        where: { follower: req.User.id },
        order: { createdAt: 'DESC' },
        take: 20
      })
    ).map(follow => follow.following);

    const timelineTweets = await Tweet.find({
      select: { id: true, createdAt: true },
      where: [{ creator: { id: 'afdcb29d-7506-4109-9ee7-fad7da443904' } }, { creator: { id: In(followings) } }],
      order: { createdAt: 'DESC' },
      take: 20
    });

    return getTweets(timelineTweets.map(tweet => tweet.id));
  }

  async addReply({ reply }: { reply: IReplyData }, req: Request): Promise<ITweet> {
    if (!req.User) throw new Error('Not authenticated.');

    const validReply = await ReplyDataValidate.validate(reply);

    const parentTweet = await Tweet.countBy({ id: validReply.tweetId });
    if (!parentTweet) throw new Error('tweet Not Found 404');

    const newReply = new Tweet();
    Object.assign(newReply, { content: validReply.content, creator: req.User.id, parent: validReply.tweetId });
    await Tweet.save(newReply);

    return getTweet(validReply.tweetId);
  }

  retweet(_ctx: { tweetId: string }, _req: Request): Promise<ITweet> {
    throw new Error('Method not implemented.');
  }

  async deleteTweet({ tweetId }: { tweetId: string }, req: Request): Promise<ITweet> {
    if (!req.User) throw new Error('Not authenticated.');

    const tweet = await Tweet.countBy({ id: tweetId, creator: { id: req.User.id } }).catch(_ => {
      throw new Error('tweet id Not Valid');
    });
    if (!tweet) throw new Error('Not Found 404');

    const fiveSec = 5000;
    setTimeout(() => {
      Tweet.delete({ id: tweetId });
    }, fiveSec);

    return getTweet(tweetId);
  }
}

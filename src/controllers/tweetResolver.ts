import type { Request } from 'express';
import type { IReplyData, ITweet, ITweetData, ITweetResolver } from '../types';
import { Tweet, User } from '../models';
import { TweetDataValidate, ReplyDataValidate, parseTweet, TimelineOptionsValidate } from '../libs';

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
    this.unRetweet = this.unRetweet;
    this.deleteTweet = this.deleteTweet;
    this.like = this.like;
    this.unLike = this.unLike;
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

    const { limit = 20, skip = 0 } = await TimelineOptionsValidate.validate(req.query);

    const timelineTweets = await Tweet.createQueryBuilder('tweet')
      .where('tweet.creator_id = :id', { id: req.User.id })
      .orWhere(qb => {
        const sub = qb
          .subQuery()
          .select(['followings.id'])
          .from(User, 'user')
          .innerJoin('user.followings', 'followings')
          .where('user.id = :uid', { uid: req.User.id })
          .getQuery();
        return 'tweet.creator_id IN ' + sub;
      })
      .orderBy('tweet.createdAt', 'DESC')
      .take(Math.min(limit, 50))
      .skip(skip)
      .getMany();

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

  async retweet({ tweetId }: { tweetId: string }, req: Request): Promise<ITweet> {
    if (!req.User) throw new Error('Not authenticated.');

    const tweet = await Tweet.findOneByOrFail({ id: tweetId });
    if (!tweet) throw new Error('Not Found 404');

    (await req.User.retweets).push(tweet);
    await req.User.save();

    return parseTweet(tweet);
  }

  async unRetweet({ tweetId }: { tweetId: string }, req: Request): Promise<ITweet> {
    if (!req.User) throw new Error('Not authenticated.');

    const tweet = await Tweet.findOneByOrFail({ id: tweetId });
    if (!tweet) throw new Error('Not Found 404');

    req.User.retweets = Promise.resolve((await req.User.retweets).filter(twt => twt.id !== tweet.id));
    await req.User.save();

    return parseTweet(tweet);
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

  async unLike({ tweetId }: { tweetId: string }, req: Request): Promise<ITweet> {
    if (!req.User) throw new Error('Not authenticated.');

    const tweet = await Tweet.findOneByOrFail({ id: tweetId });
    if (!tweet) throw new Error('Not Found 404');

    req.User.likes = Promise.resolve((await req.User.likes).filter(twt => twt.id !== tweet.id));
    await req.User.save();

    return parseTweet(tweet);
  }
}

import type { Request } from 'express';
import { Gender, Tweet, User } from './models';

export type Lazy<T> = () => Promise<T>;

export interface IUser {
  id: string;
  name: string;
  userName: string;
  email: string;
  bio: string;
  birthDate: Date;
  gender: Gender;
  avatar: string;
  header: string;
  createdAt: Date;
  tweets: Lazy<Tweet[]>;
  likes: Lazy<Tweet[]>;
  followings: Lazy<User[]>;
  followers: Lazy<User[]>;
}

export interface ITweet {
  id: string;
  content: string;
  createdAt: Date;
  creator: Lazy<User>;
  likedBy: Lazy<User[]>;
  replys: Lazy<Tweet[]>;
}

export interface ICreatedUser {
  name: string;
  userName: string;
  email: string;
  birthDate: Date;
  gender: string;
  avatar: string;
}

export interface IUserToken extends IUser {
  access_token: string;
}

export interface IUserData {
  name: string;
  userName: string;
  email: string;
  birthDate: Date;
  gender: Gender;
  password: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface ITweetData {
  content: string;
}

export interface IReplyData {
  tweetId: string;
  content: string;
}

export interface IChangePasswordData {
  old: string;
  new: string;
}

export interface IUserResolver {
  me(_: never, req: Request): Promise<IUser>;
  createUser(ctx: { user: IUserData }): Promise<ICreatedUser>;
  login(ctx: { loginContent: ILoginData }): Promise<IUserToken>;
  getUser(ctx: { userName: string }, req: Request): Promise<IUser>;
  follow(ctx: { userId: string }, req: Request): Promise<IUser>;
  unfollow(ctx: { userId: string }, req: Request): Promise<IUser>;
  changePassword(ctx: { passwords: IChangePasswordData }, req: Request): Promise<IUser>;
}

export interface ITweetResolver {
  createTweet(ctx: { tweet: ITweetData }, req: Request): Promise<ITweet>;
  getTweet(ctx: { tweetId: string }, req: Request): Promise<ITweet>;
  getTimeline(_: never, req: Request): Promise<ITweet[]>;
  addReply(ctx: { reply: IReplyData }, req: Request): Promise<ITweet>;
  retweet(ctx: { tweetId: string }, req: Request): Promise<ITweet>;
  deleteTweet(ctx: { tweetId: string }, req: Request): Promise<ITweet>;
  like(ctx: { tweetId: string }, req: Request): Promise<ITweet>;
}

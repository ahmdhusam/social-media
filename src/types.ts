import type { Request } from 'express';
import { Gender } from './models';

export type GetUser = (userId: string) => Promise<IUser>;
export type GetUsers = (usersId: string[]) => Promise<IUser[]>;
export type GetTweets = (tweetsId: string[]) => Promise<ITweet[]>;

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
  tweets: GetTweets;
  followings: GetUsers;
  followers: GetUsers;
}

export interface ITweet {
  id: string;
  content: string;
  createdAt: Date;
  creator: GetUser;
}

interface ICreatedUser {
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
}

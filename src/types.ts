import type { Request } from 'express';
import type { HydratedDocument } from 'mongoose';
import type { IUserModel } from './models';

export interface Req extends Request {
    User: HydratedDocument<IUserModel> | null;
}

export type GetUser = (userId: string) => Promise<IUser>;
export type GetUsers = (usersId: string[]) => Promise<IUser[]>;
export type GetTweets = (tweetsId: string[]) => Promise<ITweet[]>;

export interface ITweet {
    id: string;
    content: string;
    replys: GetTweets;
    creator: GetUser;
}

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    tweets: GetTweets;
    following: GetUsers;
    followers: GetUsers;
}

export interface IUserToken extends IUser {
    token: string;
}

export interface ILoginInput {
    email: string;
    password: string;
}

export interface IUserInput {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
}

export interface ITweetInput {
    content: string;
}

export interface IReplyInput {
    tweetId: string;
    content: string;
}

export interface IChangePasswordInput {
    oldPassword: string;
    newPassword: string;
}

export interface IUserResolver {
    createUser(ctx: { user: IUserInput }): Promise<IUser>;
    login(ctx: { loginContent: ILoginInput }): Promise<IUserToken>;
    getUser(ctx: { userName: string }, request: Request): Promise<IUser>;
    follow(ctx: { userId: string }, request: Request): Promise<IUser>;
    unfollow(ctx: { userId: string }, request: Request): Promise<IUser>;
    changePassword(ctx: { passwords: IChangePasswordInput }, request: Request): Promise<IUser>;
}

export interface ITweetResolver {
    createTweet(ctx: { tweet: ITweetInput }, request: Request): Promise<ITweet>;
    getTweet(ctx: { tweetId: string }, request: Request): Promise<ITweet>;
    getTimeline(_: any, request: Request): Promise<ITweet[]>;
    addReply(ctx: { reply: IReplyInput }, request: Request): Promise<ITweet[]>;
    retweet(ctx: { tweetId: string }, request: Request): Promise<ITweet>;
    deleteTweet(ctx: { tweetId: string }, request: Request): Promise<ITweet>;
}

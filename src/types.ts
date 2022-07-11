import type { Request } from 'express';

export interface ValidUser {
    isValid: boolean;
    userId?: string;
    email?: string;
}

export interface Req extends Request {
    User: ValidUser;
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

export interface IReturnUser extends IUser {
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

export interface IUserResolver {
    createUser(ctx: { user: IUserInput }): Promise<IUser>;
    login(ctx: { loginContent: ILoginInput }): Promise<IReturnUser>;
    getUser(_: any, request: Request): Promise<IUser>;
    follow(ctx: { userId: string }, request: Request): Promise<IUser>;
    unfollow(ctx: { userId: string }, request: Request): Promise<IUser>;
}

export interface ITweetResolver {
    createTweet(ctx: { tweet: ITweetInput }, request: Request): Promise<ITweet>;
    getTweet(ctx: { tweetId: string }, request: Request): Promise<ITweet>;
    getTimeline(_: any, request: Request): Promise<ITweet[]>;
}

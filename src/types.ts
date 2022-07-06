import type { Request } from 'express';

export interface ValideUser {
    isValide: boolean;
    userId?: string;
    email?: string;
}

export interface Req extends Request {
    valideUser: ValideUser;
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
    friends: GetUsers;
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
    getUser(_: any, req: Request): Promise<IUser>;
}

export interface ITweetResolver {
    createTweet(tweet: ITweetInput): Promise<ITweet>;
    getTweet(): Promise<ITweet>;
    getTimeline(): Promise<ITweet>[];
}

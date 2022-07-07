import type { GetUsers, GetUser } from '../types';

import { UserModel } from '../models';

import { getTweets } from '.';

export function parseUser(user: any) {
    return {
        ...user._doc,
        id: user.id,
        tweets: getTweets.bind(null, user._doc.tweets),
        friends: getUsers.bind(null, user._doc.friends)
    };
}

export const getUser: GetUser = async (userId: string) => {
    const user = await UserModel.findById(userId).select('-_d');
    if (!user) {
        throw new Error('User Not Found');
    }
    return parseUser(user);
};

const getUsers: GetUsers = async (usersId: string[]) => {
    const users = await UserModel.find({ _id: { $in: usersId } }).select('-password');
    return users.map(parseUser);
};

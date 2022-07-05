import type { GetUsers, GetUser } from '../types';

import UserModel from '../models/userModel';

export function parseUser(user: any) {
    return {
        ...user._doc,
        id: user.id,
        friends: getUsers.bind(null, user._doc.friends)
    };
}

const getUsers: GetUsers = async (usersId: string[]) => {
    const users = await UserModel.find({ _id: { $in: usersId } }).select(
        '-password'
    );
    return users.map(user => parseUser(user));
};

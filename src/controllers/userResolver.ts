import type { Request } from 'express';
import type {
    ILoginInput,
    IUserToken,
    IUser,
    IUserInput,
    IUserResolver,
    Req,
    IChangePasswordInput
} from '../types';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserModel } from '../models';

import { UserValidate, parseUser, changePasswordValidate, loginContentValidate } from '../libs';

export default class UserResolver implements IUserResolver {
    private static instance: UserResolver;

    static get getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }

    private constructor() {
        this.createUser = this.createUser;
        this.login = this.login;
        this.getUser = this.getUser;
        this.follow = this.follow;
        this.unfollow = this.unfollow;
        this.changePassword = this.changePassword;
    }

    async createUser({ user }: { user: IUserInput }): Promise<IUser> {
        const validUser = await UserValidate.validate(user);

        validUser.password = await bcrypt.hash(validUser.password, 12);

        const savedUser = await new UserModel(validUser).save().catch(err => {
            if (err.message.includes('E11000')) throw new Error('User Exists!');
            throw new Error(err.message);
        });
        const { password, ...rest } = parseUser(savedUser);
        return rest;
    }

    async login({ loginContent }: { loginContent: ILoginInput }): Promise<IUserToken> {
        const validLoginContent = await loginContentValidate.validate(loginContent);
        const user = await UserModel.findOne({ email: validLoginContent.email });
        if (!user) throw new Error('User Not Exist!');

        const isValid = await bcrypt.compare(validLoginContent.password, user.password);
        if (!isValid) throw new Error('Password incorrect');

        const token = jwt.sign(
            { userId: user.id, email: validLoginContent.email },
            <string>process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        const { password, ...rest } = parseUser(user);
        return { ...rest, token };
    }

    async getUser({ userName }: { userName: string }, request: Request): Promise<IUser> {
        const { User }: Req = <Req>request;
        if (!User) throw new Error('Not authenticated.');

        const user = await UserModel.findOne({ userName }).select('-password');
        if (!user) throw new Error('User Not Found 404');

        return parseUser(user);
    }

    async follow({ userId }: { userId: string }, request: Request): Promise<IUser> {
        const { User }: Req = <Req>request;
        if (!User) throw new Error('Not authenticated');

        const following = await UserModel.findById(userId);
        if (!following) throw new Error('user Not Found');

        if (User.following.includes(following.id)) throw new Error('already following');

        User.following.push(following.toObject());
        following.followers.push(User.toObject());
        await Promise.all([User.save(), following.save()]);

        return parseUser(User);
    }

    async unfollow({ userId }: { userId: string }, request: Request): Promise<IUser> {
        const { User }: Req = <Req>request;
        if (!User) throw new Error('Not authenticated');

        const followedUser = await UserModel.findById(userId);
        if (!followedUser) throw new Error('user Not Found');

        if (!User.following.includes(followedUser.id) && !followedUser.followers.includes(User.id))
            throw new Error('already unfollowed');

        (User as any).following.pull(followedUser);
        (followedUser as any).followers.pull(User);
        await Promise.all([User.save(), followedUser.save()]);

        return parseUser(User);
    }

    async changePassword(
        { passwords }: { passwords: IChangePasswordInput },
        request: Request
    ): Promise<IUser> {
        const { User }: Req = <Req>request;
        if (!User) throw new Error('Not authenticated');

        const validPassword = await changePasswordValidate.validate(passwords);

        const isValid = await bcrypt.compare(validPassword.oldPassword, User.password);
        if (!isValid) throw new Error('Password incorrect');

        User.password = await bcrypt.hash(passwords.newPassword, 12);
        await User.save();

        const { password, ...rest } = parseUser(User);
        return rest;
    }
}

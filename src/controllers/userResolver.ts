import type { Request } from 'express';
import type { ILoginInput, IReturnUser, IUser, IUserInput, IUserResolver, Req } from '../types';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserModel } from '../models';

import { UserValidate, parseUser } from '../libs';

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
    }

    async createUser({ user }: { user: IUserInput }): Promise<IUser> {
        const validUser = await UserValidate.validate(user);

        validUser.password = await bcrypt.hash(validUser.password, 12);

        const savedUser = await new UserModel(validUser).save();
        const { password, ...rest } = parseUser(savedUser);
        return rest;
    }

    async login({ loginContent }: { loginContent: ILoginInput }): Promise<IReturnUser> {
        const user = await UserModel.findOne({ email: loginContent.email });
        if (!user) throw new Error('User Not Exist!');

        const isValid = await bcrypt.compare(loginContent.password, user.password);
        if (!isValid) throw new Error('Password incorrect');

        const token = jwt.sign(
            { userId: user.id, email: loginContent.email },
            <string>process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );
        const { password, ...rest } = parseUser(user);
        return { ...rest, token };
    }

    async getUser(_: any, request: Request): Promise<IUser> {
        const req: Req = <Req>request;
        if (!req.User.isValid) throw new Error('You are Not a valid user');

        const user = await UserModel.findById(req.User.userId).select('-password');
        if (!user) throw new Error('User Not Found');

        return parseUser(user);
    }
}

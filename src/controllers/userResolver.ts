import type { Request } from 'express';
import type { ILoginInput, IReturnUser, IUser, IUserInput, IUserResolver, Req } from '../types';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/userModel';

// Libs
import { UserValidate } from '../libs/validator';
import { parseUser } from '../libs/userParser';

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
        return { ...parseUser(savedUser) };
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
        return { ...parseUser(user), token };
    }

    async getUser(_: any, request: Request): Promise<IUser> {
        const req: Req = <Req>request;
        if (!req.validUser.isValid) throw new Error('You are Not a valid user');

        const user = await UserModel.findById(req.validUser.userId).select('-password');
        if (!user) throw new Error('User Not Found');

        return parseUser(user);
    }
}

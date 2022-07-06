import type { ILoginInput, IReturnUser, IUser, IUserInput, IUserResolver } from '../types';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/userModel';

// libs
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
    }

    async createUser({ user }: { user: IUserInput }): Promise<IUser> {
        const valideUser = await UserValidate.validate(user);

        valideUser.password = await bcrypt.hash(valideUser.password, 12);

        const savedUser = await new UserModel(valideUser).save();
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
}

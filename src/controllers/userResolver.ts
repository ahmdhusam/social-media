import type { IUser, IUserInput, IUserResolver } from '../types';

import bcrypt from 'bcrypt';

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
}

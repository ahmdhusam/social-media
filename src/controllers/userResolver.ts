import type { Request } from 'express';
import type {
  IUserResolver,
  IUser,
  IUserToken,
  IUserData,
  ICreatedUser,
  ILoginData,
  IChangePasswordData
} from '../types';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Follow, User } from '../models';
import { getUser, LoginDataValidate, PasswordsDataValidate, UserDataValidate } from '../libs';

export default class UserResolver implements IUserResolver {
  private static instance: UserResolver;

  private readonly salt: number = 12;

  static get getInstance(): UserResolver {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  private constructor() {
    this.me = this.me;
    this.createUser = this.createUser;
    this.login = this.login;
    this.getUser = this.getUser;
    this.follow = this.follow;
    this.unfollow = this.unfollow;
    this.changePassword = this.changePassword;
  }

  async me(_: never, req: Request): Promise<IUser> {
    if (!req.User) throw new Error('Not authenticated');

    return getUser(req.User.id);
  }

  async createUser({ user }: { user: IUserData }): Promise<ICreatedUser> {
    const validUser = await UserDataValidate.validate(user);

    validUser.password = await bcrypt.hash(validUser.password, this.salt);

    const newUser: User = new User();
    Object.assign(newUser, validUser);
    await User.save(newUser);

    return newUser;
  }

  async login({ loginContent }: { loginContent: ILoginData }): Promise<IUserToken> {
    const validLoginContent = await LoginDataValidate.validate(loginContent);

    const user = await User.findOne({
      where: { email: validLoginContent.email },
      select: {
        id: true,
        password: true
      }
    });
    if (!user) throw new Error('User Not Exist!');

    const isValid = await bcrypt.compare(validLoginContent.password, user.password);
    if (!isValid) throw new Error('Password incorrect');

    const access_token = jwt.sign({ userId: user.id, email: validLoginContent.email }, <string>process.env.SECRET_KEY, {
      expiresIn: '1h'
    });

    return { ...(await getUser(user.id)), access_token };
  }

  async getUser({ userName }: { userName: string }, req: Request): Promise<IUser> {
    if (!req.User) throw new Error('Not authenticated.');

    const user = await User.findOne({
      where: { userName },
      select: {
        id: true
      }
    });
    if (!user) throw new Error('User Not Found 404');

    return getUser(user.id);
  }

  async follow({ userId }: { userId: string }, req: Request): Promise<IUser> {
    if (!req.User) throw new Error('Not authenticated');

    const newFollow = new Follow();
    Object.assign(newFollow, {
      follower: req.User.id,
      following: userId
    });
    await Follow.save(newFollow);

    return getUser(userId);
  }

  async unfollow({ userId }: { userId: string }, req: Request): Promise<IUser> {
    if (!req.User) throw new Error('Not authenticated');

    await Follow.delete({ follower: { id: req.User.id }, following: { id: userId } });

    return getUser(userId);
  }

  async changePassword({ passwords }: { passwords: IChangePasswordData }, req: Request): Promise<IUser> {
    if (!req.User) throw new Error('Not authenticated');

    const validPassword = await PasswordsDataValidate.validate(passwords);

    const isValid = await bcrypt.compare(validPassword.old, req.User.password);
    if (!isValid) throw new Error('Password incorrect');

    req.User.password = await bcrypt.hash(passwords.new, this.salt);
    await User.save(req.User);

    return getUser(req.User.id);
  }
}

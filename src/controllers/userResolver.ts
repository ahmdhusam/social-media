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

import { User } from '../models';
import { LoginDataValidate, parseUser, PasswordsDataValidate, UserDataValidate } from '../libs';

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

    return parseUser(req.User);
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

    const user = await User.findOneByOrFail({ email: validLoginContent.email });
    if (!user) throw new Error('User Not Found 404');

    const isValid = await bcrypt.compare(validLoginContent.password, user.password);
    if (!isValid) throw new Error('Password incorrect');

    const access_token = jwt.sign({ userId: user.id, email: validLoginContent.email }, <string>process.env.SECRET_KEY, {
      expiresIn: '1h'
    });

    return { ...parseUser(user), access_token };
  }

  async getUser({ userName }: { userName: string }, req: Request): Promise<IUser> {
    if (!req.User) throw new Error('Not authenticated.');

    const user = await User.findOneByOrFail({ userName });
    if (!user) throw new Error('User Not Found 404');

    return parseUser(user);
  }

  async follow({ userId }: { userId: string }, req: Request): Promise<IUser> {
    if (!req.User) throw new Error('Not authenticated');
    if (userId === req.User.id) return parseUser(req.User);

    const followingUser = await User.findOneByOrFail({ id: userId });
    if (!followingUser) throw new Error('User Not Found 404');

    (await req.User.followings).push(followingUser);
    await req.User.save();

    return parseUser(followingUser);
  }

  async unfollow({ userId }: { userId: string }, req: Request): Promise<IUser> {
    if (!req.User) throw new Error('Not authenticated');

    const followingUser = await User.findOneByOrFail({ id: userId });
    if (!followingUser) throw new Error('User Not Found 404');

    const newFollowings = (await req.User.followings).filter(user => user.id !== followingUser.id);

    req.User.followings = Promise.resolve(newFollowings);
    await req.User.save();

    return parseUser(followingUser);
  }

  async changePassword({ passwords }: { passwords: IChangePasswordData }, req: Request): Promise<IUser> {
    if (!req.User) throw new Error('Not authenticated');

    const validPassword = await PasswordsDataValidate.validate(passwords);

    const isValid = await bcrypt.compare(validPassword.old, req.User.password);
    if (!isValid) throw new Error('Password incorrect');

    req.User.password = await bcrypt.hash(passwords.new, this.salt);
    await req.User.save();

    return parseUser(req.User);
  }
}

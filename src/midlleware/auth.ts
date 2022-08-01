import type { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import { User } from '../models';

interface ITokenData {
  userId: string;
  email: string;
}

export default async (req: Request, _: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    req.User = null;
    return next();
  }

  try {
    const tokenData = <ITokenData>jwt.verify(token, <string>process.env.SECRET_KEY);
    if (!('userId' in tokenData && 'email' in tokenData)) throw new Error('');

    const user = await User.findOneBy({ id: tokenData.userId, email: tokenData.email });
    req.User = user;
  } catch (err) {
    req.User = null;
  } finally {
    next();
  }
};

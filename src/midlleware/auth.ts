import type { Request, Response, NextFunction } from 'express';
import type { Req } from '../types';

import jwt from 'jsonwebtoken';

import { UserModel } from '../models';

interface ITokenData {
    userId: string;
    email: string;
}

export default async (request: Request, _: Response, next: NextFunction) => {
    const req: Req = request as Req;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        req.User = null;
        return next();
    }

    try {
        const tokenData = <ITokenData>jwt.verify(token, <string>process.env.SECRET_KEY);
        if (!('userId' in tokenData && 'email' in tokenData)) throw new Error('');

        const user = await UserModel.findOne({ _id: tokenData.userId, email: tokenData.email });
        req.User = user;
    } catch (err) {
        req.User = null;
    } finally {
        next();
    }
};

import jwt from 'jsonwebtoken';

import type { NextFunction, Request, Response } from 'express';
import type { Req, ValidUser } from '../types';

export default (request: Request, _: Response, next: NextFunction) => {
    const req: Req = request as Req;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        req.User = { isValid: false };
        return next();
    }

    try {
        const user = <ValidUser>jwt.verify(token, <string>process.env.SECRET_KEY);
        user.isValid = true;
        req.User = user;
    } catch (err) {
        req.User = { isValid: false };
    } finally {
        next();
    }
};

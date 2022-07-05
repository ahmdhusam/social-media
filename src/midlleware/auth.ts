import jwt from 'jsonwebtoken';

import type { NextFunction, Request, Response } from 'express';
import type { Req, ValideUser } from '../types';

export default (request: Request, _: Response, next: NextFunction) => {
    const req: Req = request as Req;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        req.valideUser = { isValide: false };
        return next();
    }

    try {
        const user = <ValideUser>(
            jwt.verify(token, <string>process.env.SECRET_KEY)
        );
        user.isValide = true;
        req.valideUser = user;
    } catch (err) {
        req.valideUser = { isValide: false };
    } finally {
        next();
    }
};

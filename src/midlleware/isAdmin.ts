import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, _: Response, next: NextFunction): void => {
  const { authorization } = req.headers;
  if (!authorization) throw new Error('Not authenticated.');
  const [, token] = authorization.split(' ');

  if (token !== process.env.ADMIN_ACCESS) throw new Error('Not authenticated.');

  next();
};

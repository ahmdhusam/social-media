import type { NextFunction, Request, Response } from 'express';
import type { Req } from '../../src/types';

import { describe, beforeAll, beforeEach, afterAll, it, test, expect, vi } from 'vitest';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import jwt from 'jsonwebtoken';

import { UserModel, IUserModel } from '../../src/models';
import { auth } from '../../src/midlleware';

describe('auth() midlleware', () => {
    const SECRET_KEY = 'secret',
        DBURL = 'mongodb://127.0.0.1:27017/twitter';
    process.env.SECRET_KEY = SECRET_KEY;

    let req: Request, res: Response, next: NextFunction, user: HydratedDocument<IUserModel>;

    const getReq = (authHeader: string) => <Request>{ headers: { authorization: authHeader } };

    beforeAll(async () => {
        await mongoose.connect(DBURL);
        user = await new UserModel({
            firstName: 'Ahmed',
            lastName: 'Hussam',
            email: 'ahmedhusam7@gmail.com',
            userName: 'ahmedhussam',
            password: '12345678'
        }).save();
    });

    afterAll(async () => {
        if (user instanceof Document) await user.remove();
        await mongoose.disconnect();
    });

    beforeEach(() => {
        req = getReq('');
        res = <Response>{};
        next = <NextFunction>vi.fn(() => {});
    });

    it('should run next function', async () => {
        await auth(req, res, next);

        expect(next).toHaveBeenCalledOnce();
    });

    it('should add User property to req Object', async () => {
        await auth(req, res, next);

        expect(req).to.have.property('User');
        expect(next).toHaveBeenCalledOnce();
    });

    describe('User in req to be Null value', () => {
        test('if authorization header not have space between bearer and token', async () => {
            await auth(req, res, next);

            expect((req as Req).User).toBeNull();
            expect(next).toHaveBeenCalledOnce();
        });

        test('if authorization header not have a valid token', async () => {
            req = getReq('bearer asddaui');

            await auth(req, res, next);

            expect((req as Req).User).toBeNull();
            expect(next).toHaveBeenCalledOnce();
        });

        test('if expire date not valid', async () => {
            const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
                expiresIn: 0
            });
            req = getReq('Bearer ' + token);

            await auth(req, res, next);

            expect((req as Req).User).toBeNull();
            expect(next).toHaveBeenCalledOnce();
        });

        test('if token data not of type ITokenData', async () => {
            const token = jwt.sign({ id: 'asdnui12', email: 'aajsd@mail.com' }, SECRET_KEY, {
                expiresIn: '1m'
            });
            req = getReq('Bearer ' + token);

            await auth(req, res, next);

            expect((req as Req).User).toBeNull();
            expect(next).toHaveBeenCalledOnce();
        });

        test('if token data user not find in the DataBase', async () => {
            const token = jwt.sign({ userId: 'asdnui12', email: 'aajsd@mail.com' }, SECRET_KEY, {
                expiresIn: '1m'
            });
            req = getReq('Bearer ' + token);

            await auth(req, res, next);

            expect((req as Req).User).toBeNull();
            expect(next).toHaveBeenCalledOnce();
        });
    });

    describe('User to be instance of mongoose Document', () => {
        let token;
        beforeEach(() => {
            token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
                expiresIn: '1m'
            });
            req = getReq('Bearer ' + token);
        });

        it("should't to be null if user find in the DataBase", async () => {
            await auth(req, res, next);

            expect((req as Req).User).not.toBeNull();
            expect(next).toHaveBeenCalledOnce();
        });

        it('should User property to be instance of mongoose Document if user find in the DataBase', async () => {
            await auth(req, res, next);

            expect((req as Req).User).toBeInstanceOf(Document);
            expect(next).toHaveBeenCalledOnce();
        });
    });
});

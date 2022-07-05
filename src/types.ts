import type { Request } from 'express';

export interface ValideUser {
    isValide: boolean;
    userId?: string;
    email?: string;
}

export interface Req extends Request {
    valideUser: ValideUser;
}

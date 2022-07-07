import fs from 'fs';
import path from 'path';

import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
// import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';

// midllewares
import auth from './midlleware/auth';

// GraphQL
import graphQLSchema from './graphql/schema';
import graphQLResolver from './graphql/resolver';
const app = express();

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 60 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

const fileStream = fs.createWriteStream(path.join(__dirname, 'log.log'), {
    flags: 'a'
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
// app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan('tiny', { stream: fileStream }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(auth);

app.use(
    '/graphql',
    graphqlHTTP({
        schema: graphQLSchema,
        rootValue: graphQLResolver,
        graphiql: true,
        customFormatErrorFn: err => {
            return err;
        }
    })
);

app.use((_: Request, res: Response) => {
    res.end('404');
});

// error handler if async fn ? next(Error) : throw Error
app.use((error: any, _: Request, res: Response, _1: NextFunction) => {
    res.status(505).json({ message: error.message });
});

const PORT = process.env.PORT ?? 5500;
(async function main() {
    await mongoose
        .connect(typeof process.env.DBURL === 'string' ? process.env.DBURL : '')
        .catch(err => console.log('DBError', err));

    app.listen(PORT, () => {
        console.log('Server running on ', PORT);
    });
})();

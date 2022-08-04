import fs from 'fs';
import path from 'path';

import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { graphqlHTTP } from 'express-graphql';

// Midllewares
import { auth, isAdmin } from './midlleware';

// GraphQL
import { graphQLSchema, graphQLResolver } from './graphql';

import { User } from './models';
import { AppDataSource } from './libs';
import { __isProd__ } from './constants';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      User: User | null;
    }
  }
}

const app = express();

const oneHour = 60 * 60 * 1000;
const limiter = rateLimit({
  // 60 minutes
  windowMs: oneHour,
  // Limit each IP to 100 requests per `window` (here, per 60 minutes)
  max: 100,
  // Return rate limit info in the `RateLimit-*` headers
  standardHeaders: true,
  // Disable the `X-RateLimit-*` headers
  legacyHeaders: false
});

const fileStream = fs.createWriteStream(path.join(__dirname, '..', 'logs', 'log.log'), {
  flags: 'a'
});

// Apply the rate limiting middleware to all requests
__isProd__ && app.use(limiter);
__isProd__ && app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan('combined', { stream: fileStream }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/logs', isAdmin, express.static(path.join(__dirname, '..', 'logs')));

app.use(auth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolver,
    graphiql: !__isProd__,
    customFormatErrorFn: err => {
      return err;
    }
  })
);

app.use((_: Request, res: Response) => {
  res.end('404');
});

// Error handler if async fn ? next(Error) : throw Error
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(505).json({ message: error.message });
});

(async function main(): Promise<void> {
  const defaultPort = 3300;
  const { PORT = defaultPort } = process.env;
  await AppDataSource.initialize().catch((err: Error) => console.error('TypeOrm Error', err.message));

  app.listen(PORT, () => {
    console.log('Server running on ', PORT);
  });
})();

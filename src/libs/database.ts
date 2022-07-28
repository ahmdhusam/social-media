import { DataSource } from 'typeorm';

import { Tweet, User } from '../models';

import { __isProd__ } from '../constants';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: parseInt(process.env.PGPORT),
  username: 'postgres',
  password: process.env.PGPASSWORD,
  database: process.env.PGNAME,
  entities: [User, Tweet],
  synchronize: !__isProd__
});

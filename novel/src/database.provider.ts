import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { entities } from './entities';

export const databaseProvider: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'novel_manager',
  entities,
  synchronize: false,
};
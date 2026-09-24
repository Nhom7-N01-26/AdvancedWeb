import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { entities } from '../entities';

export const databaseProvider: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'mysql' as const,
    host: config.get<string>('DB_HOST', '127.0.0.1'),
    port: Number(config.get<string>('DB_PORT', '3306')),
    username: config.get<string>('DB_USERNAME') ?? config.get<string>('DB_USER', 'root'),
    password: config.get<string>('DB_PASSWORD', ''),
    database: config.get<string>('DB_DATABASE') ?? config.get<string>('DB_NAME', 'novel_manager'),
    entities,
    synchronize: false,
    charset: 'utf8mb4',
    logging: false,
  }),
};

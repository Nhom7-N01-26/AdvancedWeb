import { DataSource } from 'typeorm';
import { User } from '../entities';

export const USERS_REPOSITORY = 'USERS_REPOSITORY';
export const usersProvider = {
  provide: USERS_REPOSITORY,
  inject: [DataSource],
  useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
};

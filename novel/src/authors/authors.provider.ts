import { DataSource } from 'typeorm';
import { Author } from '../entities';

export const AUTHORS_REPOSITORY = 'AUTHORS_REPOSITORY';
export const authorsProvider = {
  provide: AUTHORS_REPOSITORY,
  inject: [DataSource],
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Author),
};

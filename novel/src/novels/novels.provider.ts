import { DataSource } from 'typeorm';
import { Novel } from '../entities';

export const NOVELS_REPOSITORY = 'NOVELS_REPOSITORY';
export const novelsProvider = {
  provide: NOVELS_REPOSITORY,
  inject: [DataSource],
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Novel),
};

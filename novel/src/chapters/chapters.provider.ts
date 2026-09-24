import { DataSource } from 'typeorm';
import { Chapter } from '../entities';

export const CHAPTERS_REPOSITORY = 'CHAPTERS_REPOSITORY';
export const chaptersProvider = {
  provide: CHAPTERS_REPOSITORY,
  inject: [DataSource],
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Chapter),
};

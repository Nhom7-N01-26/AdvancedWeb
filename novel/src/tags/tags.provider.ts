import { DataSource } from 'typeorm';
import { Tag } from '../entities';

export const TAGS_REPOSITORY = 'TAGS_REPOSITORY';
export const tagsProvider = {
  provide: TAGS_REPOSITORY,
  inject: [DataSource],
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Tag),
};

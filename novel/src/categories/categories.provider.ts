import { DataSource } from 'typeorm';
import { Category } from '../entities';

export const CATEGORIES_REPOSITORY = 'CATEGORIES_REPOSITORY';
export const categoriesProvider = {
  provide: CATEGORIES_REPOSITORY,
  inject: [DataSource],
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
};

import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { categoriesProvider } from './categories.provider';
import { CategoriesService } from './categories.service';

@Module({ controllers: [CategoriesController], providers: [categoriesProvider, CategoriesService], exports: [CategoriesService] })
export class CategoriesModule {}

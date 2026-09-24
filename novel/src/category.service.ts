import { Injectable } from '@nestjs/common';
import { Category } from './entities';
import { CollectionService } from './domain.service';

@Injectable()
export class CategoryService extends CollectionService<Category> {}
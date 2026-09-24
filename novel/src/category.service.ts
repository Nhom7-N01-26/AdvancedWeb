import { Injectable } from '@nestjs/common';
import { Category } from './entities';
import { CollectionService } from './domain.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService extends CollectionService<Category> {
	constructor(@InjectRepository(Category) repository: Repository<Category>) { super(repository); }
}
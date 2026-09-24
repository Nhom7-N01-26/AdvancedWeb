import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { rethrowDatabaseError } from '../common/database-error';
import { Category } from '../entities';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CATEGORIES_REPOSITORY } from './categories.provider';

@Injectable()
export class CategoriesService {
  constructor(@Inject(CATEGORIES_REPOSITORY) private readonly categories: Repository<Category>) {}
  findAll(): Promise<Category[]> { return this.categories.find({ order: { id: 'ASC' } }); }
  async findOne(id: number): Promise<Category> {
    const category = await this.categories.findOne({ where: { id }, relations: { novels: true } });
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }
  async create(dto: CreateCategoryDto): Promise<Category> {
    try { return await this.categories.save(this.categories.create(dto)); } catch (error) { rethrowDatabaseError(error); }
  }
  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, dto);
    try { return await this.categories.save(category); } catch (error) { rethrowDatabaseError(error); }
  }
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    try { await this.categories.remove(category); } catch (error) { rethrowDatabaseError(error); }
  }
}

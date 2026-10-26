import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private catRepo: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<CategoryEntity[]> {
    return await this.catRepo.find({
      order: { novel_count: 'DESC', name: 'ASC' },
    });
  }

  async findBySlug(slug: string): Promise<CategoryEntity> {
    const cat = await this.catRepo.findOne({
      where: { slug },
      relations: {
        novels: { author: true },
      },
    });
    if (!cat) {
      throw new NotFoundException('Không tìm thấy thể loại');
    }
    return cat;
  }

  async create(name: string, description?: string, icon?: string): Promise<CategoryEntity> {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');

    const existing = await this.catRepo.findOne({ where: [{ name }, { slug }] });
    if (existing) {
      throw new ConflictException('Thể loại này đã tồn tại');
    }

    const cat = this.catRepo.create({
      name,
      slug,
      description,
      icon: icon || '',
    });

    return await this.catRepo.save(cat);
  }
}

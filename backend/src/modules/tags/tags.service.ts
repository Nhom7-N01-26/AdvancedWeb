import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private tagRepo: Repository<TagEntity>,
  ) {}

  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<TagEntity | null> {
    return await this.tagRepo.findOne({ where: { id } });
  }
}

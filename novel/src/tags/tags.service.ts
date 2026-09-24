import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { rethrowDatabaseError } from '../common/database-error';
import { Tag } from '../entities';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TAGS_REPOSITORY } from './tags.provider';

@Injectable()
export class TagsService {
  constructor(@Inject(TAGS_REPOSITORY) private readonly tags: Repository<Tag>) {}
  findAll(): Promise<Tag[]> { return this.tags.find({ order: { id: 'ASC' } }); }
  async findOne(id: number): Promise<Tag> {
    const tag = await this.tags.findOne({ where: { id }, relations: { novels: true } });
    if (!tag) throw new NotFoundException(`Tag ${id} not found`);
    return tag;
  }
  async create(dto: CreateTagDto): Promise<Tag> {
    try { return await this.tags.save(this.tags.create(dto)); } catch (error) { rethrowDatabaseError(error); }
  }
  async update(id: number, dto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);
    Object.assign(tag, dto);
    try { return await this.tags.save(tag); } catch (error) { rethrowDatabaseError(error); }
  }
  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    try { await this.tags.remove(tag); } catch (error) { rethrowDatabaseError(error); }
  }
}

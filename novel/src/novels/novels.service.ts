import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { rethrowDatabaseError } from '../common/database-error';
import { Author, Category, Novel, NovelStatus, Tag } from '../entities';
import { CreateNovelDto } from './dto/create-novel.dto';
import { UpdateNovelDto } from './dto/update-novel.dto';
import { NOVELS_REPOSITORY } from './novels.provider';

@Injectable()
export class NovelsService {
  constructor(
    @Inject(NOVELS_REPOSITORY) private readonly novels: Repository<Novel>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(): Promise<Novel[]> {
    return this.novels.find({ relations: { author: true, categories: true, tags: true }, order: { id: 'DESC' } });
  }

  async findOne(id: number): Promise<Novel> {
    const novel = await this.novels.findOne({
      where: { id },
      relations: { author: true, categories: true, tags: true, chapters: true },
    });
    if (!novel) throw new NotFoundException(`Novel ${id} not found`);
    return novel;
  }

  async create(dto: CreateNovelDto): Promise<Novel> {
    const author = await this.dataSource.getRepository(Author).findOneBy({ id: dto.authorId });
    if (!author) throw new BadRequestException(`Author ${dto.authorId} not found`);
    const categories = await this.findCategories(dto.categoryIds);
    const tags = await this.findTags(dto.tagIds);
    const novel = this.novels.create({
      author,
      title: dto.title,
      slug: dto.slug,
      description: dto.description,
      coverImage: dto.coverImage,
      status: dto.status ?? NovelStatus.DRAFT,
      publishedAt: dto.status === NovelStatus.ONGOING || dto.status === NovelStatus.COMPLETED ? new Date() : null,
      categories,
      tags,
    });
    try { return await this.novels.save(novel); } catch (error) { rethrowDatabaseError(error); }
  }

  async update(id: number, dto: UpdateNovelDto): Promise<Novel> {
    const novel = await this.findOne(id);
    if (dto.authorId !== undefined) {
      const author = await this.dataSource.getRepository(Author).findOneBy({ id: dto.authorId });
      if (!author) throw new BadRequestException(`Author ${dto.authorId} not found`);
      novel.author = author;
    }
    if (dto.categoryIds !== undefined) novel.categories = await this.findCategories(dto.categoryIds);
    if (dto.tagIds !== undefined) novel.tags = await this.findTags(dto.tagIds);
    Object.assign(novel, {
      title: dto.title ?? novel.title,
      slug: dto.slug ?? novel.slug,
      description: dto.description ?? novel.description,
      coverImage: dto.coverImage ?? novel.coverImage,
      status: dto.status ?? novel.status,
    });
    if (dto.status !== undefined) {
      novel.publishedAt = dto.status === NovelStatus.ONGOING || dto.status === NovelStatus.COMPLETED ? novel.publishedAt ?? new Date() : null;
    }
    try { return await this.novels.save(novel); } catch (error) { rethrowDatabaseError(error); }
  }

  async remove(id: number): Promise<void> {
    const novel = await this.findOne(id);
    try { await this.novels.remove(novel); } catch (error) { rethrowDatabaseError(error); }
  }

  private async findCategories(ids: number[] | undefined): Promise<Category[]> {
    if (!ids?.length) return [];
    const categories = await this.dataSource.getRepository(Category).findBy({ id: In(ids) });
    if (categories.length !== new Set(ids).size) throw new BadRequestException('One or more categories do not exist');
    return categories;
  }

  private async findTags(ids: number[] | undefined): Promise<Tag[]> {
    if (!ids?.length) return [];
    const tags = await this.dataSource.getRepository(Tag).findBy({ id: In(ids) });
    if (tags.length !== new Set(ids).size) throw new BadRequestException('One or more tags do not exist');
    return tags;
  }
}

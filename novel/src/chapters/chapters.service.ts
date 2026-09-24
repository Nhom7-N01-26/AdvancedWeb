import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { rethrowDatabaseError } from '../common/database-error';
import { Chapter, ChapterStatus, Novel } from '../entities';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { CHAPTERS_REPOSITORY } from './chapters.provider';

@Injectable()
export class ChaptersService {
  constructor(@Inject(CHAPTERS_REPOSITORY) private readonly chapters: Repository<Chapter>) {}

  findAll(novelId?: number): Promise<Chapter[]> {
    return this.chapters.find({
      where: novelId ? { novel: { id: novelId } } : undefined,
      relations: { novel: true },
      order: { novel: { id: 'ASC' }, chapterNumber: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Chapter> {
    const chapter = await this.chapters.findOne({ where: { id }, relations: { novel: true } });
    if (!chapter) throw new NotFoundException(`Chapter ${id} not found`);
    return chapter;
  }

  async create(dto: CreateChapterDto): Promise<Chapter> {
    const novel = await this.chapters.manager.getRepository(Novel).findOneBy({ id: dto.novelId });
    if (!novel) throw new BadRequestException(`Novel ${dto.novelId} not found`);
    const chapter = this.chapters.create({
      novel,
      chapterNumber: dto.chapterNumber,
      title: dto.title,
      content: dto.content,
      wordCount: this.countWords(dto.content),
      status: dto.status ?? ChapterStatus.DRAFT,
      publishedAt: dto.status === ChapterStatus.PUBLISHED ? new Date() : null,
    });
    try { return await this.chapters.save(chapter); } catch (error) { rethrowDatabaseError(error); }
  }

  async update(id: number, dto: UpdateChapterDto): Promise<Chapter> {
    const chapter = await this.findOne(id);
    if (dto.novelId !== undefined && dto.novelId !== chapter.novel.id) {
      const novel = await this.chapters.manager.getRepository(Novel).findOneBy({ id: dto.novelId });
      if (!novel) throw new BadRequestException(`Novel ${dto.novelId} not found`);
      chapter.novel = novel;
    }
    Object.assign(chapter, {
      chapterNumber: dto.chapterNumber ?? chapter.chapterNumber,
      title: dto.title ?? chapter.title,
      content: dto.content ?? chapter.content,
      wordCount: dto.content !== undefined ? this.countWords(dto.content) : chapter.wordCount,
      status: dto.status ?? chapter.status,
    });
    if (dto.status !== undefined) chapter.publishedAt = dto.status === ChapterStatus.PUBLISHED ? chapter.publishedAt ?? new Date() : null;
    try { return await this.chapters.save(chapter); } catch (error) { rethrowDatabaseError(error); }
  }

  async remove(id: number): Promise<void> {
    const chapter = await this.findOne(id);
    try { await this.chapters.remove(chapter); } catch (error) { rethrowDatabaseError(error); }
  }

  private countWords(content: string): number { return content.trim() ? content.trim().split(/\s+/).length : 0; }
}

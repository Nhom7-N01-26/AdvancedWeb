import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChapterEntity } from './entities/chapter.entity';
import { NovelEntity } from '../novels/entities/novel.entity';
import { ChapterStatus } from '../../common/enums';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(ChapterEntity)
    private chapterRepo: Repository<ChapterEntity>,
    @InjectRepository(NovelEntity)
    private novelRepo: Repository<NovelEntity>,
  ) {}

  async findByNovel(novelId: number): Promise<ChapterEntity[]> {
    return await this.chapterRepo.find({
      where: { novel_id: novelId, status: ChapterStatus.PUBLISHED },
      order: { chapter_number: 'ASC' },
    });
  }

  async findOne(id: number): Promise<any> {
    const chapter = await this.chapterRepo.findOne({
      where: { id },
      relations: {
        novel: { author: true },
      },
    });

    if (!chapter) {
      throw new NotFoundException(`Không tìm thấy chương truyện với ID: ${id}`);
    }

    // Tăng lượt xem cho chương và truyện (Câu 2b Sơ đồ thuật toán 3)
    await this.chapterRepo.increment({ id }, 'views', 1);
    await this.novelRepo.increment({ id: chapter.novel_id }, 'total_views', 1);

    // Tìm chương trước và chương sau để điều hướng (Usability)
    const prevChapter = await this.chapterRepo.findOne({
      where: {
        novel_id: chapter.novel_id,
        chapter_number: chapter.chapter_number - 1,
        status: ChapterStatus.PUBLISHED,
      },
    });

    const nextChapter = await this.chapterRepo.findOne({
      where: {
        novel_id: chapter.novel_id,
        chapter_number: chapter.chapter_number + 1,
        status: ChapterStatus.PUBLISHED,
      },
    });

    return {
      ...chapter,
      prevChapter: prevChapter ? { id: prevChapter.id, chapter_number: prevChapter.chapter_number, title: prevChapter.title } : null,
      nextChapter: nextChapter ? { id: nextChapter.id, chapter_number: nextChapter.chapter_number, title: nextChapter.title } : null,
    };
  }

  async create(novelId: number, title: string, content: string, chapterNumber?: number): Promise<ChapterEntity> {
    const novel = await this.novelRepo.findOne({ where: { id: novelId } });
    if (!novel) {
      throw new NotFoundException('Không tìm thấy truyện');
    }

    let cNum = chapterNumber;
    if (!cNum) {
      const maxCh = await this.chapterRepo.findOne({
        where: { novel_id: novelId },
        order: { chapter_number: 'DESC' },
      });
      cNum = (maxCh?.chapter_number || 0) + 1;
    }

    const wordCount = content.trim().split(/\s+/).length;

    const chapter = this.chapterRepo.create({
      novel_id: novelId,
      chapter_number: cNum,
      title,
      content,
      word_count: wordCount,
      status: ChapterStatus.PUBLISHED,
      published_at: new Date(),
    });

    return await this.chapterRepo.save(chapter);
  }
}

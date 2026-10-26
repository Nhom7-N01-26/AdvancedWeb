import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingHistoryEntity } from './entities/reading-history.entity';
import { UpdateHistoryDto } from './dto/history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(ReadingHistoryEntity)
    private historyRepo: Repository<ReadingHistoryEntity>,
  ) {}

  async getUserHistory(userId: number): Promise<ReadingHistoryEntity[]> {
    return await this.historyRepo.find({
      where: { user_id: userId },
      relations: {
        novel: { author: true },
        chapter: true,
      },
      order: { read_at: 'DESC' },
      take: 20,
    });
  }

  async getNovelHistory(userId: number, novelId: number): Promise<ReadingHistoryEntity | null> {
    return await this.historyRepo.findOne({
      where: { user_id: userId, novel_id: novelId },
      relations: {
        chapter: true,
      },
    });
  }

  async recordProgress(userId: number, dto: UpdateHistoryDto): Promise<ReadingHistoryEntity> {
    let history = await this.historyRepo.findOne({
      where: { user_id: userId, novel_id: dto.novel_id },
    });

    if (history) {
      history.chapter_id = dto.chapter_id;
      history.progress_percent = dto.progress_percent ?? history.progress_percent;
      history.read_at = new Date();
    } else {
      history = this.historyRepo.create({
        user_id: userId,
        novel_id: dto.novel_id,
        chapter_id: dto.chapter_id,
        progress_percent: dto.progress_percent ?? 0,
        read_at: new Date(),
      });
    }

    return await this.historyRepo.save(history);
  }
}

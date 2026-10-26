import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookmarkEntity } from './entities/bookmark.entity';
import { NovelEntity } from '../novels/entities/novel.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(BookmarkEntity)
    private bookmarkRepo: Repository<BookmarkEntity>,
    @InjectRepository(NovelEntity)
    private novelRepo: Repository<NovelEntity>,
  ) {}

  async getUserBookmarks(userId: number): Promise<BookmarkEntity[]> {
    return await this.bookmarkRepo.find({
      where: { user_id: userId },
      relations: {
        novel: {
          author: true,
          categories: true,
        },
      },
      order: { created_at: 'DESC' },
    });
  }

  async checkStatus(userId: number, novelId: number): Promise<{ isBookmarked: boolean }> {
    const existing = await this.bookmarkRepo.findOne({
      where: { user_id: userId, novel_id: novelId },
    });
    return { isBookmarked: !!existing };
  }

  async toggleBookmark(userId: number, novelId: number): Promise<{ isBookmarked: boolean; message: string }> {
    const novel = await this.novelRepo.findOne({ where: { id: novelId } });
    if (!novel) {
      throw new NotFoundException('Không tìm thấy truyện');
    }

    const existing = await this.bookmarkRepo.findOne({
      where: { user_id: userId, novel_id: novelId },
    });

    if (existing) {
      await this.bookmarkRepo.remove(existing);
      return { isBookmarked: false, message: 'Đã xóa khỏi danh sách yêu thích' };
    } else {
      const bookmark = this.bookmarkRepo.create({
        user_id: userId,
        novel_id: novelId,
      });
      await this.bookmarkRepo.save(bookmark);
      return { isBookmarked: true, message: 'Đã lưu vào danh sách yêu thích' };
    }
  }
}

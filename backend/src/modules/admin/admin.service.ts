import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { NovelEntity } from '../novels/entities/novel.entity';
import { ChapterEntity } from '../chapters/entities/chapter.entity';
import { CommentEntity } from '../comments/entities/comment.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(NovelEntity)
    private novelRepo: Repository<NovelEntity>,
    @InjectRepository(ChapterEntity)
    private chapterRepo: Repository<ChapterEntity>,
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
  ) {}

  async getDashboardKpi(): Promise<any> {
    const totalUsers = await this.userRepo.count();
    const totalNovels = await this.novelRepo.count();
    const totalChapters = await this.chapterRepo.count();
    const totalComments = await this.commentRepo.count();

    const viewsResult = await this.novelRepo
      .createQueryBuilder('novel')
      .select('SUM(novel.total_views)', 'totalViews')
      .getRawOne();

    const topNovels = await this.novelRepo.find({
      order: { total_views: 'DESC' },
      take: 5,
    });

    const recentUsers = await this.userRepo.find({
      order: { created_at: 'DESC' },
      take: 5,
    });

    return {
      kpi: {
        totalUsers,
        totalNovels,
        totalChapters,
        totalComments,
        totalViews: parseInt(viewsResult?.totalViews || 0, 10),
      },
      topNovels: topNovels.map((n) => ({
        id: n.id,
        title: n.title,
        slug: n.slug,
        total_views: n.total_views,
        avg_rating: n.avg_rating,
        cover_image: n.cover_image,
      })),
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        full_name: u.full_name,
        role: u.role,
        is_active: u.is_active,
        created_at: u.created_at,
      })),
    };
  }
}

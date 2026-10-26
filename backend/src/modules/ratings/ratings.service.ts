import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingEntity } from './entities/rating.entity';
import { NovelEntity } from '../novels/entities/novel.entity';
import { UpsertRatingDto } from './dto/rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(RatingEntity)
    private ratingRepo: Repository<RatingEntity>,
    @InjectRepository(NovelEntity)
    private novelRepo: Repository<NovelEntity>,
  ) {}

  async findByNovel(novelId: number): Promise<any> {
    const ratings = await this.ratingRepo.find({
      where: { novel_id: novelId },
      relations: { user: true },
      order: { created_at: 'DESC' },
    });

    const totalRatings = ratings.length;
    const avgRating = totalRatings > 0
      ? (ratings.reduce((acc, curr) => acc + Number(curr.score), 0) / totalRatings)
      : 0;

    return {
      novel_id: novelId,
      total_ratings: totalRatings,
      avg_rating: parseFloat(avgRating.toFixed(2)),
      booking_score: parseFloat((avgRating * 2).toFixed(1)), // Chuyển đổi thang điểm 10 Booking.com
      items: ratings.map((r) => ({
        id: r.id,
        score: r.score,
        review: r.review,
        created_at: r.created_at,
        user: {
          id: r.user?.id,
          username: r.user?.username,
          full_name: r.user?.full_name,
          avatar_url: r.user?.avatar_url,
        },
      })),
    };
  }

  async findUserRating(novelId: number, userId: number): Promise<RatingEntity | null> {
    return await this.ratingRepo.findOne({
      where: { novel_id: novelId, user_id: userId },
    });
  }

  async upsert(userId: number, dto: UpsertRatingDto): Promise<RatingEntity> {
    const novel = await this.novelRepo.findOne({ where: { id: dto.novel_id } });
    if (!novel) {
      throw new NotFoundException('Không tìm thấy truyện');
    }

    let rating = await this.ratingRepo.findOne({
      where: { novel_id: dto.novel_id, user_id: userId },
    });

    if (rating) {
      rating.score = dto.rating;
      if (dto.review_text !== undefined) {
        rating.review = dto.review_text;
      }
    } else {
      rating = this.ratingRepo.create({
        novel_id: dto.novel_id,
        user_id: userId,
        score: dto.rating,
        review: dto.review_text || '',
      });
    }

    const savedRating = await this.ratingRepo.save(rating);

    // Tính lại trung bình và cập nhật Novel
    const stats = await this.ratingRepo
      .createQueryBuilder('r')
      .select('AVG(r.score)', 'avg')
      .addSelect('COUNT(r.id)', 'count')
      .where('r.novel_id = :novelId', { novelId: dto.novel_id })
      .getRawOne();

    await this.novelRepo.update(
      { id: dto.novel_id },
      {
        avg_rating: parseFloat(Number(stats.avg || 0).toFixed(2)),
        total_ratings: parseInt(stats.count || 0, 10),
      },
    );

    return savedRating;
  }
}

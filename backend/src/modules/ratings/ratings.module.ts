import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { RatingEntity } from './entities/rating.entity';
import { NovelEntity } from '../novels/entities/novel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RatingEntity, NovelEntity])],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingsModule {}

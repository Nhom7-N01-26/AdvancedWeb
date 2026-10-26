import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { ChapterEntity } from './entities/chapter.entity';
import { NovelEntity } from '../novels/entities/novel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChapterEntity, NovelEntity])],
  controllers: [ChaptersController],
  providers: [ChaptersService],
  exports: [ChaptersService],
})
export class ChaptersModule {}

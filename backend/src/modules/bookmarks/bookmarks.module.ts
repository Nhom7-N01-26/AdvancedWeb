import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { BookmarkEntity } from './entities/bookmark.entity';
import { NovelEntity } from '../novels/entities/novel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookmarkEntity, NovelEntity])],
  controllers: [BookmarksController],
  providers: [BookmarksService],
  exports: [BookmarksService],
})
export class BookmarksModule {}

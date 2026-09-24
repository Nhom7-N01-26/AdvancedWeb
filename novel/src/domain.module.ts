import { Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { BookmarkController } from './bookmark.controller';
import { CategoryController } from './category.controller';
import { ChapterController } from './chapter.controller';
import { CommentController } from './comment.controller';
import { domainProviders } from './domain.providers';
import { NovelController } from './novel.controller';
import { TagController } from './tag.controller';
import { UserController } from './user.controller';
import { RatingController } from './rating.controller';
import { ReadingHistoryController } from './reading-history.controller';

@Module({
  controllers: [
    UserController,
    AuthorController,
    CategoryController,
    TagController,
    NovelController,
    ChapterController,
    CommentController,
    RatingController,
    BookmarkController,
    ReadingHistoryController,
  ],
  providers: domainProviders,
  exports: domainProviders,
})
export class DomainModule {}
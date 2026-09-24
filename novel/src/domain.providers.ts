import { Provider } from '@nestjs/common';
import { Author, Category, Chapter, Novel, Tag, User } from './entities';
import { AuthorService } from './author.service';
import { CategoryService } from './category.service';
import { ChapterService } from './chapter.service';
import { NovelService } from './novel.service';
import { TagService } from './tag.service';
import { UserService } from './user.service';
import { BookmarkService } from './bookmark.service';
import { CommentService } from './comment.service';
import { RatingService } from './rating.service';
import { ReadingHistoryService } from './reading-history.service';

export const DOMAIN_ENTITIES = [User, Author, Category, Tag, Novel, Chapter];

export const domainProviders: Provider[] = [
  { provide: 'DOMAIN_ENTITIES', useValue: DOMAIN_ENTITIES },
  UserService,
  AuthorService,
  CategoryService,
  TagService,
  NovelService,
  ChapterService,
  CommentService,
  RatingService,
  BookmarkService,
  ReadingHistoryService,
];
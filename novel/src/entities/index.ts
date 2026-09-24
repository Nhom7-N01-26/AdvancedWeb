import { Author } from './author.entity';
import { Bookmark } from './bookmark.entity';
import { Category } from './category.entity';
import { Chapter } from './chapter.entity';
import { Comment } from './comment.entity';
import { Novel } from './novel.entity';
import { Rating } from './rating.entity';
import { ReadingHistory } from './reading-history.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

export const entities = [User, Author, Category, Tag, Novel, Chapter, Comment, Rating, Bookmark, ReadingHistory];

export * from './author.entity';
export * from './bookmark.entity';
export * from './category.entity';
export * from './chapter.entity';
export * from './comment.entity';
export * from './novel.entity';
export * from './rating.entity';
export * from './reading-history.entity';
export * from './tag.entity';
export * from './user.entity';

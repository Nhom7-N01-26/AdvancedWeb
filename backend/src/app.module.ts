import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import { UserEntity } from './modules/users/entities/user.entity';
import { AuthorEntity } from './modules/authors/entities/author.entity';
import { CategoryEntity } from './modules/categories/entities/category.entity';
import { TagEntity } from './modules/tags/entities/tag.entity';
import { NovelEntity } from './modules/novels/entities/novel.entity';
import { ChapterEntity } from './modules/chapters/entities/chapter.entity';
import { CommentEntity } from './modules/comments/entities/comment.entity';
import { RatingEntity } from './modules/ratings/entities/rating.entity';
import { BookmarkEntity } from './modules/bookmarks/entities/bookmark.entity';
import { ReadingHistoryEntity } from './modules/history/entities/reading-history.entity';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AuthorsModule } from './modules/authors/authors.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { NovelsModule } from './modules/novels/novels.module';
import { ChaptersModule } from './modules/chapters/chapters.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { CommentsModule } from './modules/comments/comments.module';
import { HistoryModule } from './modules/history/history.module';
import { TagsModule } from './modules/tags/tags.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 3306)),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD', '2550330533'),
        database: config.get('DB_DATABASE', 'novel_manager'),
        entities: [
          UserEntity,
          AuthorEntity,
          CategoryEntity,
          TagEntity,
          NovelEntity,
          ChapterEntity,
          CommentEntity,
          RatingEntity,
          BookmarkEntity,
          ReadingHistoryEntity,
        ],
        synchronize: false, // Sử dụng schema MySQL đã tạo và seed
        logging: false,
        ssl: config.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : undefined,
      }),
    }),
    AuthModule,
    UsersModule,
    AuthorsModule,
    CategoriesModule,
    NovelsModule,
    ChaptersModule,
    RatingsModule,
    BookmarksModule,
    CommentsModule,
    HistoryModule,
    TagsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';
import { ChaptersModule } from './chapters/chapters.module';
import { databaseProvider } from './database/database.provider';
import { NovelsModule } from './novels/novels.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../.env', '../My-Node-Project/.env'] }),
    TypeOrmModule.forRootAsync(databaseProvider),
    UsersModule,
    AuthorsModule,
    CategoriesModule,
    TagsModule,
    NovelsModule,
    ChaptersModule,
  ],
})
export class AppModule {}

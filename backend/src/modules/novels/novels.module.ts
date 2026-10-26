import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NovelsService } from './novels.service';
import { NovelsController } from './novels.controller';
import { NovelEntity } from './entities/novel.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import { AuthorEntity } from '../authors/entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NovelEntity, CategoryEntity, AuthorEntity])],
  controllers: [NovelsController],
  providers: [NovelsService],
  exports: [NovelsService],
})
export class NovelsModule {}

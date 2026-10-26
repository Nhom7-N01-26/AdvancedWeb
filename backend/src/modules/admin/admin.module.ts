import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserEntity } from '../users/entities/user.entity';
import { NovelEntity } from '../novels/entities/novel.entity';
import { ChapterEntity } from '../chapters/entities/chapter.entity';
import { CommentEntity } from '../comments/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, NovelEntity, ChapterEntity, CommentEntity])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

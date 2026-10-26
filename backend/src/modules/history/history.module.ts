import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { ReadingHistoryEntity } from './entities/reading-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReadingHistoryEntity])],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}

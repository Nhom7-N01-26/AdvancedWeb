import { Injectable } from '@nestjs/common';
import { ReadingHistory } from './entities';
import { CollectionService } from './domain.service';

@Injectable()
export class ReadingHistoryService extends CollectionService<ReadingHistory> {}
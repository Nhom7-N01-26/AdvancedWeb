import { Injectable } from '@nestjs/common';
import { ReadingHistory } from './entities';
import { CollectionService } from './domain.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReadingHistoryService extends CollectionService<ReadingHistory> {
	constructor(@InjectRepository(ReadingHistory) repository: Repository<ReadingHistory>) { super(repository); }
}
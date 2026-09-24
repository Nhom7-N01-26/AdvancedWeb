import { Injectable } from '@nestjs/common';
import { Chapter } from './entities';
import { CollectionService } from './domain.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChapterService extends CollectionService<Chapter> {
	constructor(@InjectRepository(Chapter) repository: Repository<Chapter>) { super(repository); }
}
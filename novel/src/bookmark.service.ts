import { Injectable } from '@nestjs/common';
import { Bookmark } from './entities';
import { CollectionService } from './domain.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BookmarkService extends CollectionService<Bookmark> {
	constructor(@InjectRepository(Bookmark) repository: Repository<Bookmark>) { super(repository); }
}
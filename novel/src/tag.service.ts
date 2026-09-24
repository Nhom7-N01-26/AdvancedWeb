import { Injectable } from '@nestjs/common';
import { Tag } from './entities';
import { CollectionService } from './domain.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TagService extends CollectionService<Tag> {
	constructor(@InjectRepository(Tag) repository: Repository<Tag>) { super(repository); }
}
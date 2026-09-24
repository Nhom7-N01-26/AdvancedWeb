import { Injectable } from '@nestjs/common';
import { Author } from './entities';
import { CollectionService } from './domain.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthorService extends CollectionService<Author> {
	constructor(@InjectRepository(Author) repository: Repository<Author>) { super(repository); }
}
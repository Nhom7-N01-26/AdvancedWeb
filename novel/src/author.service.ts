import { Injectable } from '@nestjs/common';
import { Author } from './entities';
import { CollectionService } from './domain.service';

@Injectable()
export class AuthorService extends CollectionService<Author> {}
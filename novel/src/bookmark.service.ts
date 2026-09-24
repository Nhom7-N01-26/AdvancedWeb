import { Injectable } from '@nestjs/common';
import { Bookmark } from './entities';
import { CollectionService } from './domain.service';

@Injectable()
export class BookmarkService extends CollectionService<Bookmark> {}
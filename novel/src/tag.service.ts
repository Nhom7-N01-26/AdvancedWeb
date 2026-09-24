import { Injectable } from '@nestjs/common';
import { Tag } from './entities';
import { CollectionService } from './domain.service';

@Injectable()
export class TagService extends CollectionService<Tag> {}
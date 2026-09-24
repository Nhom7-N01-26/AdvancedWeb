import { Injectable } from '@nestjs/common';
import { Chapter } from './entities';
import { CollectionService } from './domain.service';

@Injectable()
export class ChapterService extends CollectionService<Chapter> {}
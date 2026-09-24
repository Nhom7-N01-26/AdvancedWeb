import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Novel } from './entities';
import { Repository } from 'typeorm';
import { CollectionService } from './domain.service';

export type CreateNovelInput = Pick<Novel, 'title' | 'slug'> & Partial<Novel> & { author_id?: number };

@Injectable()
export class NovelService extends CollectionService<Novel> {
  constructor(@InjectRepository(Novel) repository: Repository<Novel>) { super(repository); }
}
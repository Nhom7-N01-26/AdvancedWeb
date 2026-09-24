import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Novel } from './entities';
import { Repository } from 'typeorm';
import { CollectionService } from './domain.service';

export type CreateNovelInput = Pick<Novel, 'title' | 'slug' | 'author_id'> & Partial<Novel>;

@Injectable()
export class NovelService extends CollectionService<Novel> {
  constructor(@InjectRepository(Novel) repository: Repository<Novel>) { super(repository); }
}
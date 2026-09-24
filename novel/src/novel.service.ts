import { Injectable, NotFoundException } from '@nestjs/common';
import { Novel } from './entities';

export type CreateNovelInput = Pick<Novel, 'title' | 'slug' | 'author_id'> & Partial<Novel>;

@Injectable()
export class NovelService {
  private readonly novels: Novel[] = [];
  private nextId = 1;

  findAll(): Novel[] {
    return this.novels;
  }

  findOne(id: number): Novel {
    const novel = this.novels.find((item) => item.id === id);
    if (!novel) throw new NotFoundException(`Không tìm thấy truyện có mã ${id}`);
    return novel;
  }

  create(input: CreateNovelInput): Novel {
    const novel = Object.assign(new Novel(), input, {
      id: this.nextId++,
      status: input.status ?? 'draft',
      created_at: new Date(),
      updated_at: new Date(),
    });
    this.novels.push(novel);
    return novel;
  }

  remove(id: number): void {
    const index = this.novels.findIndex((item) => item.id === id);
    if (index < 0) throw new NotFoundException(`Không tìm thấy truyện có mã ${id}`);
    this.novels.splice(index, 1);
  }
}
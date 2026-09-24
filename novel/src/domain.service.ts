import { NotFoundException } from '@nestjs/common';
import { DeepPartial, ObjectLiteral, Repository } from 'typeorm';

export abstract class CollectionService<T extends ObjectLiteral & { id: number }> {
  constructor(private readonly repository: Repository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<T> {
    const record = await this.repository.findOne({ where: { id } as never });
    if (!record) throw new NotFoundException(`Không tìm thấy bản ghi có mã ${id}`);
    return record;
  }

  create(input: DeepPartial<T>): Promise<T> {
    return this.repository.save(this.repository.create(input));
  }

  async update(id: number, input: DeepPartial<T>): Promise<T> {
    const record = await this.findOne(id);
    return this.repository.save(Object.assign(record, input));
  }

  async remove(id: number): Promise<void> {
    const record = await this.findOne(id);
    await this.repository.remove(record);
  }
}
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { rethrowDatabaseError } from '../common/database-error';
import { Author, User } from '../entities';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AUTHORS_REPOSITORY } from './authors.provider';

@Injectable()
export class AuthorsService {
  constructor(@Inject(AUTHORS_REPOSITORY) private readonly authors: Repository<Author>) {}

  findAll(): Promise<Author[]> { return this.authors.find({ relations: { user: true }, order: { id: 'ASC' } }); }

  async findOne(id: number): Promise<Author> {
    const author = await this.authors.findOne({ where: { id }, relations: { user: true, novels: true } });
    if (!author) throw new NotFoundException(`Author ${id} not found`);
    return author;
  }

  async create(dto: CreateAuthorDto): Promise<Author> {
    try {
      return await this.authors.save(this.authors.create({
        user: { id: dto.userId } as User,
        penName: dto.penName,
        bio: dto.bio,
        avatarUrl: dto.avatarUrl,
      }));
    } catch (error) { rethrowDatabaseError(error); }
  }

  async update(id: number, dto: UpdateAuthorDto): Promise<Author> {
    const author = await this.findOne(id);
    Object.assign(author, {
      user: dto.userId ? ({ id: dto.userId } as User) : author.user,
      penName: dto.penName ?? author.penName,
      bio: dto.bio ?? author.bio,
      avatarUrl: dto.avatarUrl ?? author.avatarUrl,
    });
    try { return await this.authors.save(author); } catch (error) { rethrowDatabaseError(error); }
  }

  async remove(id: number): Promise<void> {
    const author = await this.findOne(id);
    try { await this.authors.remove(author); } catch (error) { rethrowDatabaseError(error); }
  }
}

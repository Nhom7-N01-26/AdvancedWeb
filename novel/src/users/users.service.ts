import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { rethrowDatabaseError } from '../common/database-error';
import { User } from '../entities';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USERS_REPOSITORY } from './users.provider';

@Injectable()
export class UsersService {
  constructor(@Inject(USERS_REPOSITORY) private readonly users: Repository<User>) {}

  findAll(): Promise<User[]> {
    return this.users.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    try {
      return await this.users.save(this.users.create({
        username: dto.username,
        email: dto.email,
        passwordHash: dto.passwordHash,
        fullName: dto.fullName,
        avatarUrl: dto.avatarUrl,
        role: dto.role,
        isActive: dto.isActive,
      }));
    } catch (error) {
      rethrowDatabaseError(error);
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, {
      username: dto.username ?? user.username,
      email: dto.email ?? user.email,
      passwordHash: dto.passwordHash ?? user.passwordHash,
      fullName: dto.fullName ?? user.fullName,
      avatarUrl: dto.avatarUrl ?? user.avatarUrl,
      role: dto.role ?? user.role,
      isActive: dto.isActive ?? user.isActive,
    });
    try {
      return await this.users.save(user);
    } catch (error) {
      rethrowDatabaseError(error);
    }
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    try {
      await this.users.remove(user);
    } catch (error) {
      rethrowDatabaseError(error);
    }
  }
}

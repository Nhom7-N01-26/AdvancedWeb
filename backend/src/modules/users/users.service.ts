import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRole } from '../../common/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async findAll(page = 1, limit = 10): Promise<{ items: UserEntity[]; total: number }> {
    const [items, total] = await this.userRepo.findAndCount({
      relations: { author: true },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total };
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { author: true },
    });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  async updateStatus(id: number, isActive: boolean): Promise<UserEntity> {
    const user = await this.findById(id);
    user.is_active = isActive;
    return await this.userRepo.save(user);
  }

  async updateRole(id: number, role: UserRole): Promise<UserEntity> {
    const user = await this.findById(id);
    user.role = role;
    return await this.userRepo.save(user);
  }
}

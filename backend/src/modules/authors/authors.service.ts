import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorEntity } from './entities/author.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from '../../common/enums';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(AuthorEntity)
    private authorRepo: Repository<AuthorEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<AuthorEntity[]> {
    return await this.authorRepo.find({
      order: { total_novels: 'DESC' },
    });
  }

  async findById(id: number): Promise<AuthorEntity> {
    const author = await this.authorRepo.findOne({
      where: { id },
      relations: {
        novels: true,
        user: true,
      },
    });
    if (!author) {
      throw new NotFoundException('Không tìm thấy tác giả');
    }
    return author;
  }

  async createOrUpdateProfile(
    userId: number,
    penName: string,
    bio?: string,
    avatarUrl?: string,
  ): Promise<AuthorEntity> {
    let author = await this.authorRepo.findOne({ where: { user_id: userId } });

    if (!author) {
      // Nâng cấp role user thành author nếu đang là reader
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (user && user.role === UserRole.READER) {
        user.role = UserRole.AUTHOR;
        await this.userRepo.save(user);
      }

      author = this.authorRepo.create({
        user_id: userId,
        pen_name: penName,
        bio,
        avatar_url: avatarUrl,
      });
    } else {
      author.pen_name = penName;
      if (bio !== undefined) author.bio = bio;
      if (avatarUrl !== undefined) author.avatar_url = avatarUrl;
    }

    return await this.authorRepo.save(author);
  }
}

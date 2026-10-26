import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { UserEntity } from '../users/entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UserRole } from '../../common/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<UserEntity> {
    // 1. Kiểm tra username hoặc email đã tồn tại chưa
    const existing = await this.userRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });

    if (existing) {
      if (existing.username === dto.username) {
        throw new ConflictException('Tên đăng nhập đã được sử dụng');
      }
      if (existing.email === dto.email) {
        throw new ConflictException('Email đã được đăng ký trong hệ thống');
      }
    }

    // 2. Băm mật khẩu với bcrypt salt rounds = 10 (Câu 4c An ninh)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    // 3. Tạo tài khoản người dùng mới
    const newUser = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      password_hash: passwordHash,
      full_name: dto.full_name,
      avatar_url: dto.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${dto.username}`,
      role: dto.role || UserRole.READER,
      is_active: true,
    });

    return await this.userRepo.save(newUser);
  }

  async login(dto: LoginDto): Promise<{ user: UserEntity; accessToken: string; refreshToken: string }> {
    // 1. Tìm user theo email
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      relations: { author: true },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị tạm khóa');
    }

    // 2. So sánh mật khẩu băm
    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // 3. Phát sinh Access Token và Refresh Token
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET', 'novel_manager_jwt_secret_key_phenikaa_2026_!@#'),
      expiresIn: (this.configService.get<string>('JWT_EXPIRES_IN', '15m')) as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'novel_manager_jwt_refresh_secret_phenikaa_2026_$%^'),
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d')) as any,
    });

    return { user, accessToken, refreshToken };
  }

  async validateUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepo.findOne({
      where: { id, is_active: true },
      relations: { author: true },
    });
    if (!user) {
      throw new UnauthorizedException('Không tìm thấy người dùng');
    }
    return user;
  }
}

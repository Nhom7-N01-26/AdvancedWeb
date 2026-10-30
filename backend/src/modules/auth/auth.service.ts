import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserEntity } from '../users/entities/user.entity';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
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

    // Băm mật khẩu
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    // 3. Tạo tài khoản người dùng mới
    const newUser = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      password_hash: passwordHash,
      full_name: dto.full_name,
      avatar_url: dto.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${dto.username}`,
      role: UserRole.READER, // Mặc định là Reader
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

  /**
   * Quên mật khẩu: Tạo mã reset token và lưu vào DB
   * Trong môi trường dev, trả token trực tiếp; production sẽ gửi qua email
   */
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string; resetToken?: string }> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email, is_active: true },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản với email này');
    }

    // Tạo mã reset token ngẫu nhiên (6 ký tự hex viết hoa)
    const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase();

    // Token hết hạn sau 15 phút
    const resetExpires = new Date();
    resetExpires.setMinutes(resetExpires.getMinutes() + 15);

    user.reset_token = resetToken;
    user.reset_token_expires = resetExpires;
    await this.userRepo.save(user);

    // Dev mode: trả token trực tiếp (Production: gửi email)
    const isDev = this.configService.get<string>('NODE_ENV', 'development') === 'development';

    return {
      message: `Mã xác nhận đã được tạo cho email ${dto.email}. Mã có hiệu lực trong 15 phút.`,
      ...(isDev ? { resetToken } : {}),
    };
  }

  /**
   * Đặt lại mật khẩu mới bằng reset token
   */
  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({
      where: {
        reset_token: dto.token,
        is_active: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Mã xác nhận không hợp lệ');
    }

    if (!user.reset_token_expires || user.reset_token_expires < new Date()) {
      // Token hết hạn -> Xóa token
      user.reset_token = null as any;
      user.reset_token_expires = null as any;
      await this.userRepo.save(user);
      throw new BadRequestException('Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.');
    }

    // Băm mật khẩu mới
    const saltRounds = 10;
    user.password_hash = await bcrypt.hash(dto.newPassword, saltRounds);

    // Xóa reset token sau khi đổi mật khẩu thành công
    user.reset_token = null as any;
    user.reset_token_expires = null as any;

    await this.userRepo.save(user);

    return { message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.' };
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

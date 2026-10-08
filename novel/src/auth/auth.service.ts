import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private signToken(user: Pick<User, 'id' | 'username' | 'email' | 'role'>) {
    return this.jwtService.sign({
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  }

  private serializeUser(user: User) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async register(dto: RegisterDto) {
    const username = dto.username.trim();
    const email = dto.email.trim().toLowerCase();
    const fullName = dto.fullName.trim();

    if (dto.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    const existingUser = await this.usersService.findByEmailOrUsername(username, email);
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({
      username,
      email,
      passwordHash,
      fullName,
      avatarUrl: dto.avatarUrl,
      role: UserRole.READER,
      isActive: true,
    });

    const token = this.signToken(user);

    return {
      token,
      user: this.serializeUser(user),
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const token = this.signToken(user);

    return {
      token,
      user: this.serializeUser(user),
    };
  }

  async me(userId: number) {
    const user = await this.usersService.findOne(userId);
    return {
      user: this.serializeUser(user),
    };
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities';
import { UsersService } from '../users/users.service';

export type AuthenticatedUser = Pick<User, 'id' | 'username' | 'email' | 'fullName' | 'avatarUrl' | 'role'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findByUsernameForAuthentication(username);
    if (!user || !user.isActive) return null;

    try {
      if (!(await bcrypt.compare(password, user.passwordHash))) return null;
    } catch {
      return null;
    }

    return this.toAuthenticatedUser(user);
  }

  login(user: AuthenticatedUser): Promise<{ access_token: string }> {
    const payload = { sub: user.id, username: user.username, role: user.role };
    return this.jwtService.signAsync(payload).then((access_token) => ({ access_token }));
  }

  async getActiveUser(id: number): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findActiveById(id);
    return user ? this.toAuthenticatedUser(user) : null;
  }

  private toAuthenticatedUser(user: User): AuthenticatedUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
  }
}
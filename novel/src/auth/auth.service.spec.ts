import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../entities';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { vi } from 'vitest';

describe('AuthService', () => {
  const user = {
    id: 7,
    username: 'reader',
    email: 'reader@example.com',
    passwordHash: bcrypt.hashSync('correct-password', 4),
    fullName: 'Novel Reader',
    avatarUrl: null,
    role: UserRole.READER,
    isActive: true,
  };
  const findByUsernameForAuthentication = vi.fn();
  const findActiveById = vi.fn();
  const signAsync = vi.fn();
  const usersService = { findByUsernameForAuthentication, findActiveById } as unknown as UsersService;
  const jwtService = { signAsync } as unknown as JwtService;
  const authService = new AuthService(usersService, jwtService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates a password and omits the stored hash', async () => {
    findByUsernameForAuthentication.mockResolvedValue(user as never);

    const result = await authService.validateUser('reader', 'correct-password');

    expect(result).toMatchObject({ id: 7, username: 'reader' });
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('rejects an incorrect password', async () => {
    findByUsernameForAuthentication.mockResolvedValue(user as never);

    await expect(authService.validateUser('reader', 'wrong-password')).resolves.toBeNull();
  });

  it('returns a signed access token', async () => {
    signAsync.mockResolvedValue('signed.jwt.token');

    await expect(authService.login(user)).resolves.toEqual({ access_token: 'signed.jwt.token' });
    expect(signAsync).toHaveBeenCalledWith({ sub: 7, username: 'reader', role: UserRole.READER });
  });
});
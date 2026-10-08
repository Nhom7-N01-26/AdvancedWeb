import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../entities';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('registers a user and returns a JWT', async () => {
    const user: User = {
      id: 1,
      username: 'alice',
      email: 'alice@example.com',
      passwordHash: 'hashed-password',
      fullName: 'Alice Example',
      avatarUrl: null,
      role: UserRole.READER,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: null as any,
      comments: [],
      ratings: [],
      bookmarks: [],
      readingHistory: [],
    };

    const mockUsersService = {
      create: vi.fn().mockResolvedValue(user),
      findByEmailOrUsername: vi.fn().mockResolvedValue(null),
      findByEmail: vi.fn().mockResolvedValue(user),
      findOne: vi.fn().mockResolvedValue(user),
    };

    const mockJwtService = {
      sign: vi.fn().mockReturnValue('jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    const service = module.get<AuthService>(AuthService);
    const result = await service.register({
      username: 'alice',
      email: 'alice@example.com',
      password: 'password123',
      fullName: 'Alice Example',
    });

    expect(mockUsersService.findByEmailOrUsername).toHaveBeenCalledWith('alice', 'alice@example.com');
    expect(mockUsersService.create).toHaveBeenCalled();
    expect(mockJwtService.sign).toHaveBeenCalled();
    expect(result.token).toBe('jwt-token');
  });
});

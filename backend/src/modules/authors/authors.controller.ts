import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthorsService } from './authors.service';
import { Public } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';

@ApiTags('Authors - Quản Lý Tác Giả')
@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả tác giả' })
  findAll() {
    return this.authorsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết hồ sơ tác giả' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.authorsService.findById(id);
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo hoặc cập nhật hồ sơ bút danh tác giả' })
  updateProfile(
    @CurrentUser() user: UserEntity,
    @Body('pen_name') penName: string,
    @Body('bio') bio?: string,
    @Body('avatar_url') avatarUrl?: string,
  ) {
    return this.authorsService.createOrUpdateProfile(user.id, penName, bio, avatarUrl);
  }
}

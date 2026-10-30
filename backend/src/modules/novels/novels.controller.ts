import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NovelsService } from './novels.service';
import { CreateNovelDto, QueryNovelDto, UpdateNovelDto } from './dto/novel.dto';
import { Public, Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from '../../common/enums';

@ApiTags('Novels - Quản Lý Truyện & Tiểu Thuyết')
@Controller('novels')
export class NovelsController {
  constructor(private novelsService: NovelsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách truyện có phân trang, tìm kiếm & bộ lọc đa tiêu chí ' })
  findAll(@Query() query: QueryNovelDto) {
    return this.novelsService.findAll(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Lấy danh sách các bộ truyện nổi bật' })
  findFeatured() {
    return this.novelsService.findFeatured();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Lấy chi tiết truyện theo đường dẫn SEO slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.novelsService.findBySlug(slug);
  }

  @Public()
  @Post(':id/view')
  @ApiOperation({ summary: 'Tăng 1 lượt xem thực tế khi độc giả vào đọc' })
  incrementViews(@Param('id', ParseIntPipe) id: number) {
    return this.novelsService.incrementViews(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.READER, UserRole.AUTHOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng bộ truyện mới (Người dùng đã đăng nhập hoặc Admin)' })
  create(@Body() dto: CreateNovelDto, @CurrentUser() user: UserEntity) {
    return this.novelsService.create(dto, user.id, user.full_name || user.username);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin truyện (Chỉ Quản trị viên Admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNovelDto,
  ) {
    return this.novelsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa tác phẩm truyện (Chỉ Quản trị viên Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.novelsService.remove(id);
  }
}

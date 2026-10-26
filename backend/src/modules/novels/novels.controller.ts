import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NovelsService } from './novels.service';
import { CreateNovelDto, QueryNovelDto } from './dto/novel.dto';
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
  @ApiOperation({ summary: 'Lấy danh sách truyện có phân trang, tìm kiếm & bộ lọc đa tiêu chí (Booking style)' })
  findAll(@Query() query: QueryNovelDto) {
    return this.novelsService.findAll(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Lấy danh sách các bộ truyện nổi bật (Dành cho Hero Banner/Carousels)' })
  findFeatured() {
    return this.novelsService.findFeatured();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Lấy chi tiết truyện theo đường dẫn SEO slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.novelsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AUTHOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng bộ truyện mới (Tác giả hoặc Admin)' })
  create(@Body() dto: CreateNovelDto, @CurrentUser() user: UserEntity) {
    return this.novelsService.create(dto, user.id);
  }
}

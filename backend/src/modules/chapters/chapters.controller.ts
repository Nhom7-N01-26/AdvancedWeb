import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/chapter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Chapters')
@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get('novel/:novelId')
  @ApiOperation({ summary: 'Lấy danh sách tất cả chương của truyện theo novelId' })
  @ApiResponse({ status: 200, description: 'Danh sách chương sắp xếp tăng dần' })
  async findByNovel(@Param('novelId', ParseIntPipe) novelId: number) {
    return await this.chaptersService.findByNovel(novelId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy nội dung chi tiết chương truyện (tự động tăng views)' })
  @ApiResponse({ status: 200, description: 'Chi tiết chương truyện kèm điều hướng prev/next' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.chaptersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AUTHOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thêm chương mới (Dành cho Tác giả/Quản trị viên)' })
  @ApiResponse({ status: 201, description: 'Chương truyện đã được xuất bản' })
  async create(@Body() createDto: CreateChapterDto) {
    return await this.chaptersService.create(
      createDto.novel_id,
      createDto.title,
      createDto.content,
      createDto.chapter_number,
    );
  }
}

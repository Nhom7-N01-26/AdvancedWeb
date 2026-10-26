import { Controller, Get, Post, Delete, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Bookmarks')
@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get('my')
  @ApiOperation({ summary: 'Lấy danh sách truyện yêu thích của tôi' })
  @ApiResponse({ status: 200, description: 'Danh sách bookmarks' })
  async getMyBookmarks(@CurrentUser('userId') userId: number) {
    return await this.bookmarksService.getUserBookmarks(userId);
  }

  @Get('check/:novelId')
  @ApiOperation({ summary: 'Kiểm tra truyện đã lưu vào bookmark chưa' })
  async checkBookmark(
    @CurrentUser('userId') userId: number,
    @Param('novelId', ParseIntPipe) novelId: number,
  ) {
    return await this.bookmarksService.checkStatus(userId, novelId);
  }

  @Post('toggle/:novelId')
  @ApiOperation({ summary: 'Chuyển đổi trạng thái Bookmark 1-click (Thêm hoặc Bỏ yêu thích)' })
  @ApiResponse({ status: 200, description: 'Trạng thái sau khi toggle' })
  async toggle(
    @CurrentUser('userId') userId: number,
    @Param('novelId', ParseIntPipe) novelId: number,
  ) {
    return await this.bookmarksService.toggleBookmark(userId, novelId);
  }
}

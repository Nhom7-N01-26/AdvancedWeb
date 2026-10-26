import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { UpdateHistoryDto } from './dto/history.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Reading History')
@Controller('history')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get('my')
  @ApiOperation({ summary: 'Lấy lịch sử các truyện đã đọc gần đây của tôi' })
  @ApiResponse({ status: 200, description: 'Danh sách lịch sử đọc' })
  async getMyHistory(@CurrentUser('userId') userId: number) {
    return await this.historyService.getUserHistory(userId);
  }

  @Get('novel/:novelId')
  @ApiOperation({ summary: 'Lấy tiến trình đọc của một truyện cụ thể' })
  async getNovelHistory(
    @CurrentUser('userId') userId: number,
    @Param('novelId', ParseIntPipe) novelId: number,
  ) {
    return await this.historyService.getNovelHistory(userId, novelId);
  }

  @Post('record')
  @ApiOperation({ summary: 'Ghi nhận hoặc cập nhật tiến trình đọc sách tự động' })
  @ApiResponse({ status: 200, description: 'Tiến trình đọc đã được lưu' })
  async record(
    @CurrentUser('userId') userId: number,
    @Body() dto: UpdateHistoryDto,
  ) {
    return await this.historyService.recordProgress(userId, dto);
  }
}

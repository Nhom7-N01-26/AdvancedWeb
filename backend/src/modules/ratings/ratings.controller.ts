import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RatingsService } from './ratings.service';
import { UpsertRatingDto } from './dto/rating.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/roles.decorator';

@ApiTags('Ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Public()
  @Get('novel/:novelId')
  @ApiOperation({ summary: 'Lấy tất cả đánh giá & điểm Booking.com của truyện' })
  @ApiResponse({ status: 200, description: 'Danh sách đánh giá và thống kê điểm' })
  async findByNovel(@Param('novelId', ParseIntPipe) novelId: number) {
    return await this.ratingsService.findByNovel(novelId);
  }

  @Get('novel/:novelId/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy đánh giá của bản thân đối với truyện' })
  async getMyRating(
    @Param('novelId', ParseIntPipe) novelId: number,
    @CurrentUser('userId') userId: number,
  ) {
    return await this.ratingsService.findUserRating(novelId, userId);
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Đánh giá số sao và viết review (1-click Booking review)' })
  @ApiResponse({ status: 201, description: 'Đánh giá đã được ghi nhận' })
  async upsert(
    @CurrentUser('userId') currentUserId: number,
    @Body() dto: UpsertRatingDto,
  ) {
    const userId = currentUserId || (dto as any).user_id || 4;
    return await this.ratingsService.upsert(userId, dto);
  }
}


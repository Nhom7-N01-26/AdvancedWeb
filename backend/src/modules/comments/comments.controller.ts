import { Controller, Get, Post, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('novel/:novelId')
  @ApiOperation({ summary: 'Lấy danh sách bình luận kèm phân cấp trả lời' })
  @ApiQuery({ name: 'chapterId', required: false, type: Number, description: 'Lọc bình luận theo chương' })
  async findByNovel(
    @Param('novelId', ParseIntPipe) novelId: number,
    @Query('chapterId') chapterId?: string,
  ) {
    const chId = chapterId ? parseInt(chapterId, 10) : undefined;
    return await this.commentsService.findByNovel(novelId, chId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo bình luận mới hoặc trả lời bình luận khác' })
  @ApiResponse({ status: 201, description: 'Bình luận đã được đăng' })
  async create(
    @CurrentUser('userId') userId: number,
    @Body() dto: CreateCommentDto,
  ) {
    return await this.commentsService.create(userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bình luận (chỉ tác giả bình luận hoặc Admin)' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('userId') userId: number,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return await this.commentsService.remove(id, userId, userRole);
  }
}

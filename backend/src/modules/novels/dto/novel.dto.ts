import { IsNotEmpty, IsOptional, IsString, IsEnum, IsArray, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NovelStatus } from '../../../common/enums';

export class CreateNovelDto {
  @ApiProperty({ example: 'Tôi Trở Thành Thiên Tài Tốc Biến' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Tóm tắt câu chuyện...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '/public/covers/default_cover.jpg' })
  @IsOptional()
  @IsString()
  cover_image?: string;

  @ApiPropertyOptional({ enum: NovelStatus, default: NovelStatus.ONGOING })
  @IsOptional()
  @IsEnum(NovelStatus)
  status?: NovelStatus;

  @ApiPropertyOptional({ example: [1, 2], description: 'Danh sách ID thể loại' })
  @IsOptional()
  @IsArray()
  category_ids?: number[];
}

export class QueryNovelDto {
  @ApiPropertyOptional({ example: 'Hàn', description: 'Từ khóa tìm kiếm' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ example: 1, description: 'Lọc theo ID thể loại' })
  @IsOptional()
  category_id?: string;

  @ApiPropertyOptional({ enum: NovelStatus, description: 'Lọc theo trạng thái' })
  @IsOptional()
  status?: NovelStatus;

  @ApiPropertyOptional({ example: 4.0, description: 'Điểm đánh giá tối thiểu' })
  @IsOptional()
  min_rating?: string;

  @ApiPropertyOptional({ example: 'latest', enum: ['latest', 'most_viewed', 'highest_rated', 'created_at', 'total_views', 'avg_rating'] })
  @IsOptional()
  sort_by?: string;

  @ApiPropertyOptional({ example: 'DESC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  sort_order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({ example: 12, default: 12 })
  @IsOptional()
  limit?: string;
}

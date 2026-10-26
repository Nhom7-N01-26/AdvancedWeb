import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateChapterDto {
  @ApiProperty({ description: 'ID truyện', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  novel_id: number;

  @ApiProperty({ description: 'Tiêu đề chương', example: 'Chương 1: Khởi đầu mới' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Nội dung chương văn bản', example: 'Nội dung chi tiết chương truyện...' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Số thứ tự chương', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  chapter_number?: number;
}

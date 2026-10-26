import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateHistoryDto {
  @ApiProperty({ description: 'ID truyện', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  novel_id: number;

  @ApiProperty({ description: 'ID chương đang đọc', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  chapter_id: number;

  @ApiPropertyOptional({ description: 'Phần trăm tiến trình đọc trong chương (0 - 100%)', example: 75.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress_percent?: number;
}

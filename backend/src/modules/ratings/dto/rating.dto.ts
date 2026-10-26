import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpsertRatingDto {
  @ApiProperty({ description: 'ID truyện cần đánh giá', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  novel_id: number;

  @ApiProperty({ description: 'Điểm đánh giá (1 đến 5 sao)', example: 5, minimum: 1, maximum: 5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Nội dung nhận xét/review', example: 'Cốt truyện hấp dẫn, nhân vật phát triển tâm lý rất sâu sắc!' })
  @IsOptional()
  @IsString()
  review_text?: string;
}

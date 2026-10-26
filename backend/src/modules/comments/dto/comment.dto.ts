import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'ID truyện', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  novel_id: number;

  @ApiPropertyOptional({ description: 'ID chương truyện (nếu bình luận ở chương)', example: 1 })
  @IsOptional()
  @IsNumber()
  chapter_id?: number;

  @ApiPropertyOptional({ description: 'ID bình luận cha (nếu trả lời bình luận)', example: null })
  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @ApiProperty({ description: 'Nội dung bình luận', example: 'Chương này tình tiết bất ngờ quá!' })
  @IsNotEmpty()
  @IsString()
  content: string;
}

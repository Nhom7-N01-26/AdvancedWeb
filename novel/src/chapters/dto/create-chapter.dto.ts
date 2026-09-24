import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ChapterStatus } from '../../entities';

export class CreateChapterDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  novelId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  chapterNumber: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(ChapterStatus)
  status?: ChapterStatus;
}

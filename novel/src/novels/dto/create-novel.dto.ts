import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { NovelStatus } from '../../entities';

export class CreateNovelDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  authorId: number;

  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsEnum(NovelStatus)
  status?: NovelStatus;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  categoryIds?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  tagIds?: number[];
}

import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateAuthorDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId: number;

  @IsString()
  penName: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

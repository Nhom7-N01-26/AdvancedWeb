import { PartialType } from '@nestjs/mapped-types';
import { CreateNovelDto } from './create-novel.dto';

export class UpdateNovelDto extends PartialType(CreateNovelDto) {}

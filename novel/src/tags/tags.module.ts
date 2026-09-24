import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { tagsProvider } from './tags.provider';
import { TagsService } from './tags.service';

@Module({ controllers: [TagsController], providers: [tagsProvider, TagsService], exports: [TagsService] })
export class TagsModule {}

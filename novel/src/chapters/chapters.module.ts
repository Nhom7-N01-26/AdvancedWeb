import { Module } from '@nestjs/common';
import { ChaptersController } from './chapters.controller';
import { chaptersProvider } from './chapters.provider';
import { ChaptersService } from './chapters.service';

@Module({ controllers: [ChaptersController], providers: [chaptersProvider, ChaptersService], exports: [ChaptersService] })
export class ChaptersModule {}

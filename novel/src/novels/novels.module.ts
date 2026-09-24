import { Module } from '@nestjs/common';
import { NovelsController } from './novels.controller';
import { novelsProvider } from './novels.provider';
import { NovelsService } from './novels.service';

@Module({ controllers: [NovelsController], providers: [novelsProvider, NovelsService], exports: [NovelsService] })
export class NovelsModule {}

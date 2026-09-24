import { Module } from '@nestjs/common';
import { AuthorsController } from './authors.controller';
import { authorsProvider } from './authors.provider';
import { AuthorsService } from './authors.service';

@Module({ controllers: [AuthorsController], providers: [authorsProvider, AuthorsService], exports: [AuthorsService] })
export class AuthorsModule {}

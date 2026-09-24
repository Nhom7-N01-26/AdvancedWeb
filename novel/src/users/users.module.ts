import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { usersProvider } from './users.provider';
import { UsersService } from './users.service';

@Module({ controllers: [UsersController], providers: [usersProvider, UsersService], exports: [UsersService] })
export class UsersModule {}

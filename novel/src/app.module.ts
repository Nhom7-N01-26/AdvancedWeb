import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomainModule } from './domain.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProvider } from './database.provider';

@Module({
  imports: [TypeOrmModule.forRoot(databaseProvider), DomainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

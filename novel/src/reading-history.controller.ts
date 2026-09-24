import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReadingHistoryService } from './reading-history.service';

@Controller('reading-history')
export class ReadingHistoryController {
  constructor(private readonly readingHistoryService: ReadingHistoryService) {}
  @Get() findAll() { return this.readingHistoryService.findAll(); }
  @Post() create(@Body() input: any) { return this.readingHistoryService.create(input); }
}
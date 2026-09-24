import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ReadingHistoryService } from './reading-history.service';

@Controller('reading-history')
export class ReadingHistoryController {
  constructor(private readonly readingHistoryService: ReadingHistoryService) {}
  @Get() findAll() { return this.readingHistoryService.findAll(); }
  @Post() create(@Body() input: any) { return this.readingHistoryService.create(input); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() input: any) { return this.readingHistoryService.update(id, input); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.readingHistoryService.remove(id); }
}
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ChapterService } from './chapter.service';

@Controller('chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}
  @Get() findAll() { return this.chapterService.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.chapterService.findOne(id); }
  @Post() create(@Body() input: any) { return this.chapterService.create(input); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() input: any) { return this.chapterService.update(id, input); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.chapterService.remove(id); }
}
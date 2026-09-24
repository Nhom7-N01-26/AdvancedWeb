import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { ChaptersService } from './chapters.service';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}
  @Get() findAll(@Query('novelId', new ParseIntPipe({ optional: true })) novelId?: number) { return this.chaptersService.findAll(novelId); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.chaptersService.findOne(id); }
  @Post() create(@Body() dto: CreateChapterDto) { return this.chaptersService.create(dto); }
  @Put(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateChapterDto) { return this.chaptersService.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.chaptersService.remove(id); }
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateNovelDto } from './dto/create-novel.dto';
import { UpdateNovelDto } from './dto/update-novel.dto';
import { NovelsService } from './novels.service';

@Controller('novels')
export class NovelsController {
  constructor(private readonly novelsService: NovelsService) {}
  @Get() findAll() { return this.novelsService.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.novelsService.findOne(id); }
  @Post() create(@Body() dto: CreateNovelDto) { return this.novelsService.create(dto); }
  @Put(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNovelDto) { return this.novelsService.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.novelsService.remove(id); }
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}
  @Get() findAll() { return this.tagsService.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.tagsService.findOne(id); }
  @Post() create(@Body() dto: CreateTagDto) { return this.tagsService.create(dto); }
  @Put(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTagDto) { return this.tagsService.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.tagsService.remove(id); }
}

import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}
  @Get() findAll() { return this.tagService.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.tagService.findOne(id); }
  @Post() create(@Body() input: any) { return this.tagService.create(input); }
}
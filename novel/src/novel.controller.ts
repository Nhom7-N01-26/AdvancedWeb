import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateNovelInput, NovelService } from './novel.service';

@Controller('novels')
export class NovelController {
  constructor(private readonly novelService: NovelService) {}

  @Get()
  findAll() { return this.novelService.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.novelService.findOne(id); }

  @Post()
  create(@Body() input: CreateNovelInput) { return this.novelService.create(input); }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.novelService.remove(id); }
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() input: Partial<CreateNovelInput>) { return this.novelService.update(id, input); }
}
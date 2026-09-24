import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AuthorService } from './author.service';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}
  @Get() findAll() { return this.authorService.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.authorService.findOne(id); }
  @Post() create(@Body() input: any) { return this.authorService.create(input); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() input: any) { return this.authorService.update(id, input); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.authorService.remove(id); }
}
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorsService } from './authors.service';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}
  @Get() findAll() { return this.authorsService.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.authorsService.findOne(id); }
  @Post() create(@Body() dto: CreateAuthorDto) { return this.authorsService.create(dto); }
  @Put(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAuthorDto) { return this.authorsService.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.authorsService.remove(id); }
}

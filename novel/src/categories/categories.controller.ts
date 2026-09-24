import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get() findAll() { return this.categoriesService.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.categoriesService.findOne(id); }
  @Post() create(@Body() dto: CreateCategoryDto) { return this.categoriesService.create(dto); }
  @Put(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) { return this.categoriesService.update(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.categoriesService.remove(id); }
}

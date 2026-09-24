import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get() findAll() { return this.categoryService.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.categoryService.findOne(id); }
  @Post() create(@Body() input: any) { return this.categoryService.create(input); }
}
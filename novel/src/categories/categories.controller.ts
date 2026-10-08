import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @Get() findAll() { return this.categoriesService.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.categoriesService.findOne(id); }
  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) create(@Body() dto: CreateCategoryDto) { return this.categoriesService.create(dto); }
  @Put(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) { return this.categoriesService.update(id, dto); }
  @Delete(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) remove(@Param('id', ParseIntPipe) id: number) { return this.categoriesService.remove(id); }
}

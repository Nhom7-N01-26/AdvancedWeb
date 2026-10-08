import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}
  @Get() findAll() { return this.tagsService.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.tagsService.findOne(id); }
  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) create(@Body() dto: CreateTagDto) { return this.tagsService.create(dto); }
  @Put(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTagDto) { return this.tagsService.update(id, dto); }
  @Delete(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) remove(@Param('id', ParseIntPipe) id: number) { return this.tagsService.remove(id); }
}

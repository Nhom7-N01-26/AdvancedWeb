import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities';
import { CreateNovelDto } from './dto/create-novel.dto';
import { UpdateNovelDto } from './dto/update-novel.dto';
import { NovelsService } from './novels.service';

@Controller('novels')
export class NovelsController {
  constructor(private readonly novelsService: NovelsService) {}
  @Get() findAll() { return this.novelsService.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.novelsService.findOne(id); }
  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN, UserRole.AUTHOR) create(@Body() dto: CreateNovelDto) { return this.novelsService.create(dto); }
  @Put(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN, UserRole.AUTHOR) update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNovelDto) { return this.novelsService.update(id, dto); }
  @Delete(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN, UserRole.AUTHOR) remove(@Param('id', ParseIntPipe) id: number) { return this.novelsService.remove(id); }
}

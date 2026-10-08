import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { ChaptersService } from './chapters.service';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}
  @Get() findAll(@Query('novelId', new ParseIntPipe({ optional: true })) novelId?: number) { return this.chaptersService.findAll(novelId); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.chaptersService.findOne(id); }
  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN, UserRole.AUTHOR) create(@Body() dto: CreateChapterDto) { return this.chaptersService.create(dto); }
  @Put(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN, UserRole.AUTHOR) update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateChapterDto) { return this.chaptersService.update(id, dto); }
  @Delete(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN, UserRole.AUTHOR) remove(@Param('id', ParseIntPipe) id: number) { return this.chaptersService.remove(id); }
}

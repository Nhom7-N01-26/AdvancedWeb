import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorsService } from './authors.service';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}
  @Get() findAll() { return this.authorsService.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.authorsService.findOne(id); }
  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) create(@Body() dto: CreateAuthorDto) { return this.authorsService.create(dto); }
  @Put(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAuthorDto) { return this.authorsService.update(id, dto); }
  @Delete(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN) remove(@Param('id', ParseIntPipe) id: number) { return this.authorsService.remove(id); }
}

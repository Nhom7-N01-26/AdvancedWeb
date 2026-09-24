import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get() findAll() { return this.userService.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.userService.findOne(id); }
  @Post() create(@Body() input: any) { return this.userService.create(input); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() input: any) { return this.userService.update(id, input); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.userService.remove(id); }
}
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { RatingService } from './rating.service';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}
  @Get() findAll() { return this.ratingService.findAll(); }
  @Post() create(@Body() input: any) { return this.ratingService.create(input); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() input: any) { return this.ratingService.update(id, input); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.ratingService.remove(id); }
}
import { Body, Controller, Get, Post } from '@nestjs/common';
import { RatingService } from './rating.service';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}
  @Get() findAll() { return this.ratingService.findAll(); }
  @Post() create(@Body() input: any) { return this.ratingService.create(input); }
}
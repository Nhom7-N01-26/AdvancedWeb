import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}
  @Get() findAll() { return this.bookmarkService.findAll(); }
  @Post() create(@Body() input: any) { return this.bookmarkService.create(input); }
}
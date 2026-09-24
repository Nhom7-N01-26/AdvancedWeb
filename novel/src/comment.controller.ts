import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Get() findAll() { return this.commentService.findAll(); }
  @Post() create(@Body() input: any) { return this.commentService.create(input); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() input: any) { return this.commentService.update(id, input); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.commentService.remove(id); }
}
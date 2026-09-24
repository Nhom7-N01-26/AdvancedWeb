import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Get() findAll() { return this.commentService.findAll(); }
  @Post() create(@Body() input: any) { return this.commentService.create(input); }
}
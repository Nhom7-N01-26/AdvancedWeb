import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả các nhãn (tags)' })
  @ApiResponse({ status: 200, description: 'Danh sách tags' })
  async findAll() {
    return await this.tagsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết tag theo ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.tagsService.findOne(id);
  }
}

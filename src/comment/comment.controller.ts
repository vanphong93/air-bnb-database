import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { comment } from '@prisma/client';
import { decoratorConfig } from 'src/decorators/decorators';
import { CommentService } from './comment.service';
import { createComment, dataComment } from './dto';
@ApiTags('Comment')
@Controller('/api/comment')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Get('')
  @decoratorConfig(null, 'get data comment', 'success', [dataComment], 200)
  getData(): Promise<comment[]> {
    return this.commentService.getData();
  }
  @Post('')
  @decoratorConfig(null, 'create comment', 'success', dataComment, 200)
  createComment(@Body() body: createComment) {
    return this.commentService.createComment(body);
  }
  @Get('/:id')
  @decoratorConfig(null, 'get data comment by id', 'success', dataComment, 200)
  getDataByID(@Param('id') id: string): Promise<comment[]> {
    return this.commentService.getDataByID(Number(id));
  }
  @Delete('/:id')
  @decoratorConfig(
    null,
    'delete comment by id comment',
    'success',
    dataComment,
    200,
  )
  deleteComment(@Param('id') id: string): Promise<comment> {
    return this.commentService.deleteComment(Number(id));
  }
}

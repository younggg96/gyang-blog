import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DefaultValuePipe } from '@nestjs/common/pipes';
import { user as UserType } from '@prisma/client';
import { User } from 'src/auth/decorator/user.decorator';
import { Auth } from 'src/auth/decorator/auth.decorator';
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/createComment')
  @Auth()
  create(@Body() createCommentDto: CreateCommentDto, @User() user: UserType) {
    return this.commentService.create(createCommentDto, user);
  }

  @Post('/createReply')
  @Auth()
  createReply(@Body() createCommentDto: CreateCommentDto, @User() user: UserType) {
    return this.commentService.createReply(createCommentDto, user);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Get('/parentCommentId/:id')
  findChildrenComments(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('row', new DefaultValuePipe(1)) row: number,
    @Param('id') id: string,
  ) {
    return this.commentService.findChildrenComments(page, row, id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';
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
  async create(@Body() createCommentDto: CreateCommentDto, @User() user: UserType) {
    return await this.commentService.create(createCommentDto, user);
  }

  @Post('/createReply')
  @Auth()
  createReply(@Body() createCommentDto: CreateCommentDto, @User() user: UserType) {
    return this.commentService.createReply(createCommentDto, user);
  }

  @Get('/getCommentsByArticleId/:id')
  @Auth()
  findComments(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('row', new DefaultValuePipe(1)) row: number,
    @Param('id') id: string,
    @User() user: UserType,
  ) {
    return this.commentService.findComments(page, row, id, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Get('/parentCommentId/:id')
  @Auth()
  findChildrenComments(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('row', new DefaultValuePipe(1)) row: number,
    @Param('id') id: string,
    @User() user: UserType,
  ) {
    return this.commentService.findChildrenComments(page, row, id, user);
  }

  @Patch('/like/:id')
  @Auth()
  addLikeMoment(@Param('id') id: string, @User() user: UserType) {
    return this.commentService.addLike(id, user);
  }

  @Delete('/like/:id')
  @Auth()
  removeLikeMoment(@Param('id') id: string, @User() user: UserType) {
    return this.commentService.removeLike(id, user);
  }
}

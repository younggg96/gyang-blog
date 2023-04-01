import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DefaultValuePipe } from '@nestjs/common/pipes';
import { user as UserType } from '@prisma/client';
import { User } from 'src/auth/decorator/user.decorator';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { ArticleService } from 'src/article/article.service';
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService, private readonly articleService: ArticleService) {}

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

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get('/getCommentsByArticleId/:id')
  findComments(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('row', new DefaultValuePipe(1)) row: number,
    @Param('id') id: string,
  ) {
    return this.commentService.findComments(page, row, id);
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

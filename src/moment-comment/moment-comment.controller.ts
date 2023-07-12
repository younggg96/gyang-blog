import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe } from '@nestjs/common';
import { MomentCommentService } from './moment-comment.service';
import { CreateMomentCommentDto } from './dto/create-moment-comment.dto';
import { user as UserType } from '@prisma/client';
import { User } from 'src/auth/decorator/user.decorator';
import { Auth } from 'src/auth/decorator/auth.decorator';

@Controller('moment-comment')
export class MomentCommentController {
  constructor(private readonly momentCommentService: MomentCommentService) {}

  @Post('/createComment')
  @Auth()
  async create(@Body() createMomentCommentDto: CreateMomentCommentDto, @User() user: UserType) {
    return await this.momentCommentService.create(createMomentCommentDto, user);
  }

  @Post('/createReply')
  @Auth()
  async createReply(@Body() createCommentDto: CreateMomentCommentDto, @User() user: UserType) {
    return await this.momentCommentService.createReply(createCommentDto, user);
  }

  @Get('/getMomentCommentsByMomentId/:id')
  @Auth()
  findComments(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('row', new DefaultValuePipe(1)) row: number,
    @Param('id') id: string,
    @User() user: UserType,
  ) {
    return this.momentCommentService.findComments(page, row, id, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.momentCommentService.findOne(+id);
  }

  @Get('/parentMomentCommentId/:id')
  @Auth()
  findChildrenComments(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('row', new DefaultValuePipe(1)) row: number,
    @Param('id') id: string,
    @User() user: UserType,
  ) {
    return this.momentCommentService.findChildrenComments(page, row, id, user);
  }

  @Patch('/momentLike/:id')
  @Auth()
  addLikeMoment(@Param('id') id: string, @User() user: UserType) {
    return this.momentCommentService.addLike(id, user);
  }

  @Delete('/momentLike/:id')
  @Auth()
  removeLikeMoment(@Param('id') id: string, @User() user: UserType) {
    return this.momentCommentService.removeLike(id, user);
  }
}

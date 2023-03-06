import { Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';
import { CreateMomentDto } from './dto/create-moment.dto';
import { UpdateMomentDto } from './dto/update-moment.dto';
import { User } from 'src/auth/decorator/user.decorator';
import { user as UserType } from '@prisma/client';
import { DefaultValuePipe } from '@nestjs/common/pipes';
import { MomentService } from './moment.service';
import { Auth } from 'src/auth/decorator/auth.decorator';

@Controller('moment')
export class MomentController {
  constructor(private readonly momentService: MomentService) {}

  @Post()
  @Auth()
  create(@Body() createMomentDto: CreateMomentDto, @User() user: UserType) {
    return this.momentService.create(createMomentDto, user);
  }

  @Get()
  async findAll(@Query('page', new DefaultValuePipe(1)) page: number) {
    return await this.momentService.findAll(page);
  }

  @Get('/user')
  @Auth()
  findAllByUser(@Query('page', new DefaultValuePipe(1)) page: number, @User() user: UserType) {
    return this.momentService.findAllByUser(page, user);
  }

  @Get('/userId/:id')
  findAllByUserId(@Query('page', new DefaultValuePipe(1)) page: number, @Param('id') id: string) {
    return this.momentService.findAllByUserId(page, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMomentDto: UpdateMomentDto) {
    return this.momentService.update(+id, updateMomentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.momentService.remove(+id);
  }
}

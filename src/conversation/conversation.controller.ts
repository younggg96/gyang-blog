import { Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';

import { DefaultValuePipe } from '@nestjs/common/pipes';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { User } from 'src/auth/decorator/user.decorator';
import { user as UserType } from '@prisma/client';
import { Auth } from 'src/auth/decorator/auth.decorator';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
  @Post('/create')
  async createConversation(@Body() createConversationDto: CreateConversationDto) {
    return await this.conversationService.createConversation(createConversationDto);
  }

  @Get()
  @Auth()
  findAll(@Query('page', new DefaultValuePipe(1)) page: number, @User() user: UserType) {
    return this.conversationService.findAll(page, user);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';

import { DefaultValuePipe } from '@nestjs/common/pipes';
import { User } from 'src/auth/decorator/user.decorator';
import { user as UserType } from '@prisma/client';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly message: MessageService) {}
  @Post('/create')
  async createConversation(@Body() createMessageDto: CreateMessageDto) {
    return await this.message.createMessage(createMessageDto);
  }

  @Get('/:id')
  async getMessagesByConversationId(@Param() conversationId: { id: string }) {
    return await this.message.getMessagesByConversationId(conversationId);
  }

  @Get()
  @Auth()
  findAll(@Query('page', new DefaultValuePipe(1)) page: number, @User() user: UserType) {
    // return this.conversationService.findAll(page, user);
  }
}

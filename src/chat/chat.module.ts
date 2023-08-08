import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MessageService } from 'src/message/message.service';

@Module({
  providers: [ChatService, ChatGateway, MessageService],
})
export class ChatModule {}

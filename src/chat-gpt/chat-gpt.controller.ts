import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';

@Controller('chat-gpt')
export class ChatGptController {
  constructor(private readonly chatGptService: ChatGptService) {}

  @Get('/recommend')
  async recommendText(@Query('text') inputText: string): Promise<string> {
    return await this.chatGptService.recommendText(inputText);
  }
}

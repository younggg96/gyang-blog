import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { user as UserType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { paginate } from 'src/helper/helper';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    return await this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        sender: { connect: { id: createMessageDto.senderId } },
        conversation: { connect: { id: createMessageDto.conversationId } },
      },
      include: {
        sender: {
          select: { id: true, avatar: true },
        },
      },
    });
  }

  async getMessagesByConversationId(conversationId: { id: string }) {
    return await this.prisma.message.findMany({
      where: {
        conversationId: +conversationId.id,
      },
      include: {
        sender: {
          select: { id: true, avatar: true },
        },
      },
    });
  }
}

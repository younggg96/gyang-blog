import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { user as UserType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { paginate } from 'src/helper/helper';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async createConversation(createConversationDto: CreateConversationDto, user: UserType) {
    const conversationExists = await this.checkConversationExists(createConversationDto.userIds);
    if (conversationExists) {
      await this.updateConversationTimestamp(conversationExists.id, +user.id);
      return conversationExists; // 如果对话已存在，则直接返回该对话
    }

    const conversation = await this.prisma.conversation.create({
      include: {
        users: true, // 如果你想在创建时立即关联用户
      },
    });
    // 添加对话与用户的关联
    await Promise.all(
      createConversationDto.userIds.map(async (userId) => {
        await this.prisma.conversationUser.create({
          data: {
            conversation: { connect: { id: conversation.id } },
            user: { connect: { id: userId } },
          },
        });
      }),
    );

    await this.updateConversationTimestamp(conversation.id, +user.id);
    return await this.findByConversationId(conversation.id);
  }

  async checkConversationExists(userIds: number[]) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        AND: [{ users: { some: { userId: userIds[0] } } }, { users: { some: { userId: userIds[1] } } }],
      },
      include: {
        messages: true,
        users: {
          select: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
          },
        },
      },
    });

    return conversation;
  }

  async findByConversationId(id: number) {
    return await this.prisma.conversation.findUnique({
      where: {
        id,
      },
      include: {
        messages: true,
        users: {
          select: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
          },
        },
      },
    });
  }

  async findAll(p: number, user: UserType) {
    const page = +p; // sting -> number
    const row = 5; // sting -> number
    const conversations = await this.prisma.user.findUnique({
      where: {
        id: +user.id,
      },
      select: {
        conversationUser: {
          skip: (page - 1) * row,
          take: row,
          orderBy: {
            updatedAt: 'desc',
          },
          select: {
            createdAt: true,
            conversationId: true,
            conversation: {
              select: {
                users: {
                  select: {
                    user: {
                      select: { id: true, username: true, avatar: true },
                    },
                  },
                },
                _count: {
                  select: {
                    messages: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            conversationUser: true,
          },
        },
      },
    });
    return paginate({ page, data: conversations.conversationUser, total: conversations._count.conversationUser, row });
  }

  async updateConversationTimestamp(conversationId: number, userId: number) {
    await this.prisma.conversationUser.update({
      where: {
        conversationId_userId: { conversationId, userId }, // 根据需要替换为特定的 conversationId 和 userId
      },
      data: {
        updatedAt: new Date(),
      },
    });
  }

  async removeConversation(id: number) {
    return await this.prisma.conversation.delete({
      where: {
        id,
      },
    });
  }
}

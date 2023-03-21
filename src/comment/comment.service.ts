import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginate } from 'src/helper/helper';
import { user as UserType } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async create(createCommentDto: CreateCommentDto, user: UserType) {
    return await this.prisma.comment.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        article: {
          connect: {
            id: +createCommentDto.articleId,
          },
        },
        content: createCommentDto.content,
      },
    });
  }

  async createReply(createCommentDto: CreateCommentDto, user: UserType) {
    return await this.prisma.comment.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        parent: {
          connect: {
            id: +createCommentDto.parentId,
          },
        },
        article: {
          connect: {
            id: +createCommentDto.articleId,
          },
        },
        content: createCommentDto.content,
        replyTo: +createCommentDto.replyTo,
      },
    });
  }

  findAll() {
    return `This action returns all comment`;
  }

  async findOne(id: number) {
    return await this.prisma.comment.findUnique({
      where: {
        id: +id,
      },
    });
  }

  async findReplyToComment(id: number) {
    return await this.prisma.comment.findUnique({
      where: {
        id: +id,
      },
      select: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });
  }

  async findChildrenComments(p: number, r: number, parentId: string) {
    const page = +p; // sting -> number
    const row = +r;
    const childrenComments = await this.prisma.comment.findMany({
      where: {
        parentId: +parentId,
      },
      skip: (page - 1) * row,
      take: row,
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
        _count: true,
      },
    });

    const data = await Promise.all(
      childrenComments.map(async (item) => {
        return {
          ...item,
          replyToComment: item.replyTo ? await this.findReplyToComment(item.replyTo) : null,
        };
      }),
    );

    const total = await this.prisma.comment.count({
      where: {
        parentId: +parentId,
      },
    });

    return paginate({ page, data, total, row });
  }
}

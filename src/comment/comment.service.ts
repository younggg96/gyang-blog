import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleService } from 'src/article/article.service';
import { paginate, sleep } from 'src/helper/helper';
import { user as UserType } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService, private config: ConfigService, private articleService: ArticleService) {}

  async create(createCommentDto: CreateCommentDto, user: UserType) {
    const newComment = await this.prisma.comment.create({
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
    return await this.articleService.findOneByUser(+newComment.articleId, user);
  }

  async createReply(createCommentDto: CreateCommentDto, user: UserType) {
    const newComment = await this.prisma.comment.create({
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
        replyTo: +createCommentDto.replyTo || null,
      },
    });
    return await this.articleService.findOneByUser(+newComment.articleId, user);
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

  async findComments(p: number, r: number, articleId: string) {
    const page = +p; // sting -> number
    const row = +r;
    await sleep(1000);
    const comments = await this.prisma.comment.findMany({
      where: {
        articleId: +articleId,
        parentId: null,
      },
      take: page * row,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
        _count: true,
      },
    });
    const total = await this.prisma.comment.count({
      where: {
        articleId: +articleId,
        parentId: null,
      },
    });

    const data = await Promise.all(
      comments.map(async (item) => {
        return {
          ...item,
          replyToComment: item.replyTo ? await this.findReplyToComment(item.replyTo) : null,
        };
      }),
    );

    return { ...paginate({ page, data, total, row }), hasMore: comments.length < total };
  }

  async findChildrenComments(p: number, r: number, parentId: string) {
    const page = +p; // sting -> number
    const row = +r;
    await sleep(1000);
    const childrenComments = await this.prisma.comment.findMany({
      where: {
        parentId: +parentId,
      },
      take: page * row,
      orderBy: {
        createdAt: 'desc',
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

    return { ...paginate({ page, data, total, row }), hasMore: childrenComments.length < total };
  }
}

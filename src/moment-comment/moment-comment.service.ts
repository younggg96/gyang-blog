import { Injectable } from '@nestjs/common';
import { CreateMomentCommentDto } from './dto/create-moment-comment.dto';
import { UpdateMomentCommentDto } from './dto/update-moment-comment.dto';
import { user as UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MomentService } from 'src/moment/moment.service';

import { paginate } from 'src/helper/helper';

@Injectable()
export class MomentCommentService {
  constructor(private prisma: PrismaService, private config: ConfigService, private momentService: MomentService) {}

  async create(createMomentCommentDto: CreateMomentCommentDto, user: UserType) {
    const newComment = await this.prisma.momentComment.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        moment: {
          connect: {
            id: +createMomentCommentDto.momentId,
          },
        },
        content: createMomentCommentDto.content,
      },
    });
    // return newComment;
    return await this.momentService.findOneByUser(+newComment.momentId, user);
  }

  async createReply(createMomentCommentDto: CreateMomentCommentDto, user: UserType) {
    const newComment = await this.prisma.momentComment.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        parent: {
          connect: {
            id: +createMomentCommentDto.parentId,
          },
        },
        moment: {
          connect: {
            id: +createMomentCommentDto.momentId,
          },
        },
        content: createMomentCommentDto.content,
        replyTo: +createMomentCommentDto.replyTo || null,
      },
    });
    return await this.momentService.findOneByUser(+newComment.momentId, user);
  }

  async findOne(id: number) {
    return await this.prisma.momentComment.findUnique({
      where: {
        id: +id,
      },
    });
  }

  async findReplyToComment(id: number) {
    return await this.prisma.momentComment.findUnique({
      where: {
        id: +id,
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });
  }

  async findComments(p: number, r: number, momentId: string, user: UserType) {
    const page = +p; // sting -> number
    const row = +r;
    const comments = await this.prisma.momentComment.findMany({
      where: {
        momentId: +momentId,
        parentId: null,
      },
      take: page * row,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        momentCommentLikes: true,
        user: {
          select: { id: true, username: true, avatar: true },
        },
        _count: true,
      },
    });

    const total = await this.prisma.momentComment.count({
      where: {
        momentId: +momentId,
        parentId: null,
      },
    });

    const data = await Promise.all(
      comments.map(async (item) => {
        const curUserLiked = await this.prisma.momentCommentLike.findFirst({
          where: {
            userId: user.id,
            momentCommentId: item.id,
          },
        });
        return {
          ...item,
          curUserLiked: !!curUserLiked,
          replyToComment: item.replyTo ? await this.findReplyToComment(item.replyTo) : null,
        };
      }),
    );

    return { ...paginate({ page, data, total, row }), hasMore: comments.length < total };
  }

  async findChildrenComments(p: number, r: number, parentId: string, user: UserType) {
    const page = +p; // sting -> number
    const row = +r;
    const childrenComments = await this.prisma.momentComment.findMany({
      where: {
        parentId: +parentId,
      },
      take: page * row,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        momentCommentLikes: true,
        user: {
          select: { id: true, username: true, avatar: true },
        },
        _count: true,
      },
    });

    const data = await Promise.all(
      childrenComments.map(async (item) => {
        const curUserLiked = await this.prisma.momentCommentLike.findFirst({
          where: {
            userId: user.id,
            momentCommentId: item.id,
          },
        });
        return {
          ...item,
          curUserLiked: !!curUserLiked,
          replyToComment: item.replyTo ? await this.findReplyToComment(item.replyTo) : null,
        };
      }),
    );

    const total = await this.prisma.momentComment.count({
      where: {
        parentId: +parentId,
      },
    });

    return { ...paginate({ page, data, total, row }), hasMore: childrenComments.length < total };
  }

  async addLike(id: string, user: UserType) {
    const existLike = await this.prisma.momentCommentLike.findFirst({
      where: {
        momentCommentId: +id,
        userId: user.id,
      },
    });
    if (!existLike) {
      await this.prisma.momentCommentLike.create({
        data: {
          momentCommentId: +id,
          userId: user.id,
        },
      });
      const count = await this.prisma.momentCommentLike.count({
        where: {
          momentCommentId: +id,
        },
      });
      return {
        count,
        success: 'Like comment success!',
      };
    }
  }

  async removeLike(id: string, user: UserType) {
    const existLike = await this.prisma.momentCommentLike.findFirst({
      where: {
        momentCommentId: +id,
        userId: user.id,
      },
    });
    if (existLike) {
      await this.prisma.momentCommentLike.delete({
        where: {
          id: +existLike.id,
        },
      });
      const count = await this.prisma.momentCommentLike.count({
        where: {
          momentCommentId: +id,
        },
      });
      return {
        count,
        success: 'Unlike comment success!',
      };
    }
  }

  update(id: number, updateMomentCommentDto: UpdateMomentCommentDto) {
    return `This action updates a #${id} momentComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} momentComment`;
  }
}

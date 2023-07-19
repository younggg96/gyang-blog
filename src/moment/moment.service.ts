import { Injectable } from '@nestjs/common';
import { CreateMomentDto } from './dto/create-moment.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { user as UserType } from '@prisma/client';
import { paginate } from 'src/helper/helper';
import _ from 'lodash';

@Injectable()
export class MomentService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async checkCurUserLike(moments, userId: number) {
    return await Promise.all(
      moments.map(async (item) => {
        const curUserLiked = await this.prisma.momentLike.findFirst({
          where: {
            userId,
            momentId: item.id,
          },
        });
        return {
          ...item,
          curUserLiked: !!curUserLiked,
        };
      }),
    );
  }

  async getMomentsCount() {
    return await this.prisma.moment.count();
  }

  async getMomentsCountByUserId(userId: number) {
    return await this.prisma.moment.count({
      where: {
        userId: +userId,
      },
    });
  }

  async create(createMomentDto: CreateMomentDto, user: UserType) {
    return await this.prisma.moment.create({
      data: {
        content: createMomentDto.content,
        imgs: {
          createMany: {
            data: createMomentDto.imgs.map((imgUrl) => ({ url: imgUrl })),
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async findAll(p: number) {
    const page = +p; // sting -> number
    const row = +this.config.get('ARTICLE_PAGE_ROW'); // sting -> number
    const moments = await this.prisma.moment.findMany({
      skip: (page - 1) * row,
      take: row,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
        momentlikes: {
          select: { userId: true, id: true },
        },
        imgs: true,
        _count: true,
      },
    });
    return paginate({ page, data: moments, total: await this.getMomentsCount(), row });
  }

  async findAllByUser(p: number, user: UserType) {
    const page = +p; // sting -> number
    const row = +this.config.get('ARTICLE_PAGE_ROW'); // sting -> number
    const moments = await this.prisma.moment.findMany({
      skip: (page - 1) * row,
      take: row,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
        momentlikes: {
          select: { userId: true, id: true },
        },
        imgs: true,
        _count: true,
      },
    });
    // check user like moment
    const data = await this.checkCurUserLike(moments, user.id);
    return paginate({ page, data, total: await this.getMomentsCount(), row });
  }

  async findAllByUserId(p: number, id: string) {
    const page = +p; // sting -> number
    const row = +this.config.get('ARTICLE_PAGE_ROW'); // sting -> number
    const momentsByUser = await this.prisma.moment.findMany({
      where: {
        userId: +id,
      },
      skip: (page - 1) * row,
      take: row,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
        momentlikes: {
          select: { userId: true, id: true },
        },
        imgs: true,
        _count: true,
      },
    });
    return paginate({ page, data: momentsByUser, total: await this.getMomentsCountByUserId(+id), row });
  }

  async findOne(id: number) {
    const data = await this.prisma.moment.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true, email: true },
        },
        momentlikes: true,
        momentComments: {
          where: {
            parentId: null,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
          include: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
            momentCommentLikes: true,
            _count: true,
          },
        },
        _count: true,
      },
    });

    const commentCount = await this.getMomentsCount();

    return { ...data, commentCount, curUserLiked: null };
  }

  async findOneByUser(id: number, user: UserType) {
    const data = await this.prisma.moment.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true, email: true },
        },
        imgs: true,
        momentlikes: true,
        momentComments: {
          where: {
            parentId: null,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
          include: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
            momentCommentLikes: true,
            _count: true,
          },
        },
        _count: true,
      },
    });
    const curUserLiked = await this.checkCurUserLike(data.momentComments, user.id);
    return { ...data, curUserLiked };
  }

  async addLikeMoment(id: string, user: UserType) {
    const existLike = await this.prisma.momentLike.findFirst({
      where: {
        momentId: +id,
        userId: user.id,
      },
    });
    if (!existLike) {
      await this.prisma.momentLike.create({
        data: {
          momentId: +id,
          userId: user.id,
        },
      });
      const count = await this.prisma.momentLike.count({
        where: {
          momentId: +id,
        },
      });
      return {
        count,
        success: 'Like moment success!',
      };
    }
  }

  async removeLikeMoment(id: string, user: UserType) {
    const existLike = await this.prisma.momentLike.findFirst({
      where: {
        momentId: +id,
        userId: user.id,
      },
    });
    if (existLike) {
      await this.prisma.momentLike.delete({
        where: {
          id: +existLike.id,
        },
      });
      const count = await this.prisma.momentLike.count({
        where: {
          momentId: +id,
        },
      });
      return {
        count,
        success: 'Unlike moment success!',
      };
    }
  }
}

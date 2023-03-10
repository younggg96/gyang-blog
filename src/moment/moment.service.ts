import { Injectable } from '@nestjs/common';
import { CreateMomentDto } from './dto/create-moment.dto';
import { UpdateMomentDto } from './dto/update-moment.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { user as UserType } from '@prisma/client';
import { paginate, sleep } from 'src/helper/helper';
import _ from 'lodash';

@Injectable()
export class MomentService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async create(createMomentDto: CreateMomentDto, user: UserType) {
    return await this.prisma.moment.create({
      data: {
        content: createMomentDto.content,
        userId: user.id,
      },
    });
  }

  async findAll(p: number, user: UserType) {
    const page = +p; // sting -> number
    const row = +this.config.get('ARTICLE_PAGE_ROW'); // sting -> number
    const moments = await this.prisma.moment.findMany({
      skip: (page - 1) * row,
      take: row,
      orderBy: { id: 'asc' },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
        momentlikes: {
          select: { userId: true, id: true },
        },
        momentComments: {
          select: {
            user: true,
            content: true,
            createdAt: true,
          },
        },
        imgs: true,
      },
    });
    const data = await Promise.all(
      moments.map(async (item) => {
        const curUserLiked = await this.prisma.momentLike.findFirst({
          where: {
            userId: user.id,
            momentId: item.id,
          },
        });
        return {
          ...item,
          curUserLiked: !!curUserLiked,
        };
      }),
    );
    const total = await this.prisma.moment.count();
    return paginate({ page, data, total, row });
  }

  async findAllByUser(p: number, user: UserType) {
    const page = +p; // sting -> number
    const row = +this.config.get('ARTICLE_PAGE_ROW'); // sting -> number
    const moments = await this.prisma.moment.findMany({
      where: {
        userId: user.id,
      },
      skip: (page - 1) * row,
      take: row,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        imgs: true,
      },
    });
    const momentsByUser = await this.prisma.moment.findMany({
      where: {
        userId: user.id,
      },
    });
    return paginate({ page, data: moments, total: momentsByUser.length, row });
  }

  async findAllByUserId(p: number, id: string) {
    const page = +p; // sting -> number
    const row = +this.config.get('ARTICLE_PAGE_ROW'); // sting -> number
    const articles = await this.prisma.moment.findMany({
      where: {
        userId: +id,
      },
      skip: (page - 1) * row,
      take: row,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        imgs: true,
      },
    });
    const momentsByUser = await this.prisma.moment.findMany({
      where: {
        userId: +id,
      },
    });
    return paginate({ page, data: articles, total: momentsByUser.length, row });
  }

  update(id: number, updateMomentDto: UpdateMomentDto) {
    return `This action updates a #${id} moment`;
  }

  remove(id: number) {
    return `This action removes a #${id} moment`;
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
    } else {
      return {
        count: -1,
        success: 'Like moment failed!',
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
    } else {
      return {
        count: -1,
        success: 'Unlike moment failed!',
      };
    }
  }
}

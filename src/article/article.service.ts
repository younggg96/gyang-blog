import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

import { user as UserType } from '@prisma/client';
import { paginate, sleep } from 'src/helper/helper';
import _ from 'lodash';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async create(createArticleDto: CreateArticleDto, user: UserType) {
    return await this.prisma.article.create({
      data: {
        title: createArticleDto.title,
        content: createArticleDto.content,
        img: createArticleDto.img,
        userId: user.id,
        categories: {
          create: {
            categoryId: +createArticleDto.categoryId,
          },
        },
      },
    });
  }

  async findAll(p: number) {
    const page = +p; // sting -> number
    const row = +this.config.get('ARTICLE_PAGE_ROW'); // sting -> number
    const articles = await this.prisma.article.findMany({
      skip: (page - 1) * row,
      take: row,
      orderBy: { id: 'desc' },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
        categories: true,
        comments: {
          where: {
            parentId: null,
          },
          include: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
            _count: true,
          },
        },
      },
    });
    const total = await this.prisma.article.count();
    return paginate({ page, data: articles, total, row });
  }

  async findAllByUser(p: number, user: UserType) {
    const page = +p; // sting -> number
    const row = +this.config.get('ARTICLE_PAGE_ROW'); // sting -> number
    const articles = await this.prisma.article.findMany({
      where: {
        userId: user.id,
      },
      skip: (page - 1) * row,
      take: row,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        categories: true,
        comments: {
          where: {
            parentId: null,
          },
          include: {
            replies: {
              select: {
                id: true,
                createdAt: true,
                user: true,
                content: true,
              },
            },
            user: {
              select: { id: true, username: true, avatar: true },
            },
          },
        },
      },
    });
    const articlesByUserCount = await this.prisma.article.count({
      where: {
        userId: user.id,
      },
    });
    return paginate({ page, data: articles, total: articlesByUserCount, row });
  }

  async findAllByUserId(p: number, id: string) {
    const page = +p; // sting -> number
    const row = +this.config.get('ARTICLE_PAGE_ROW'); // sting -> number
    const articles = await this.prisma.article.findMany({
      where: {
        userId: +id,
      },
      skip: (page - 1) * row,
      take: row,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        categories: true,
        comments: {
          where: {
            parentId: null,
          },
          include: {
            replies: {
              select: {
                id: true,
                createdAt: true,
                user: true,
                content: true,
              },
            },
            user: {
              select: { id: true, username: true, avatar: true },
            },
          },
        },
      },
    });
    const articlesByUserCount = await this.prisma.article.count({
      where: {
        userId: +id,
      },
    });
    return paginate({ page, data: articles, total: articlesByUserCount, row });
  }

  async findAllByCategoryId(p: number, id: string) {
    const page = +p; // sting -> number
    const row = +this.config.get('ARTICLE_PAGE_ROW'); // sting -> number
    const articlesIds = await this.prisma.articleCategory.findMany({
      where: {
        categoryId: +id,
      },
    });
    const articles = [];
    for (const element of articlesIds) {
      const data = await this.prisma.article.findUnique({
        where: {
          id: element.articleId,
        },
      });
      articles.push(data);
    }
    return paginate({ page, data: articles, total: articles.length, row });
  }

  async findOne(id: number) {
    const data = await this.prisma.article.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
        categories: true,
        comments: {
          where: {
            parentId: null,
          },
          take: 3,
          include: {
            user: {
              select: { id: true, username: true, avatar: true },
            },
            _count: true,
          },
        },
      },
    });

    const commentCount = await this.prisma.comment.count({
      where: {
        articleId: id,
      },
    });

    return { ...data, commentCount };
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    return await this.prisma.article.update({
      where: {
        id,
      },
      data: { ..._.pick(updateArticleDto, ['title', 'content']) },
    });
  }

  async remove(id: number) {
    return await this.prisma.article.delete({
      where: {
        id,
      },
    });
  }
}

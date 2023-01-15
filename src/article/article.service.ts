import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

import { user as UserType } from '@prisma/client';
import { paginate } from 'src/helper/helper';
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
      },
    });
    const total = await this.prisma.article.count();
    return paginate({ page, data: articles, total, row });
  }

  async findAllByUserId(p: number, user: UserType) {
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
    });
    const articlesByUser = await this.prisma.article.findMany({
      where: {
        userId: user.id,
      },
    });
    return paginate({ page, data: articles, total: articlesByUser.length, row });
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
    return await this.prisma.article.findFirst({
      where: {
        id,
      },
      include: {
        user: { select: { id: true, avatar: true, username: true } },
      },
    });
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

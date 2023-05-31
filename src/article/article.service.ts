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

  async checkCurUserLikeComment(comments, userId: number) {
    return await Promise.all(
      comments.map(async (item) => {
        const curUserLiked = await this.prisma.commentLike.findFirst({
          where: {
            userId,
            commentId: item.id,
          },
        });
        return {
          ...item,
          curUserLiked: !!curUserLiked,
        };
      }),
    );
  }

  async checkCurUserLike(articleId: number, userId: number) {
    return !!(await this.prisma.like.findFirst({
      where: {
        userId,
        articleId,
      },
    }));
  }

  async articleLikeCount(articleId: number) {
    return await this.prisma.like.count({
      where: {
        articleId,
      },
    });
  }

  async getCommentCount(articleId) {
    return await this.prisma.comment.count({
      where: {
        articleId,
      },
    });
  }

  async createArticleCategory(categoryId, articleId) {
    await this.prisma.articleCategory.create({
      data: {
        categoryId,
        articleId,
      },
    });
  }

  async create(createArticleDto: CreateArticleDto, user: UserType) {
    const article = await this.prisma.article.create({
      data: {
        title: createArticleDto.title,
        content: createArticleDto.content,
        description: createArticleDto.description,
        img: createArticleDto.img,
        user: {
          connect: { id: user.id },
        },
        published: createArticleDto.published,
        categories: {
          createMany: {
            skipDuplicates: true,
            data: createArticleDto.categoryIds.map((id) => ({ categoryId: id })),
          },
        },
      },
    });
    return article;
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
          select: { id: true, username: true, avatar: true, email: true },
        },
        like: true,
        categories: true,
        comments: {
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
            commentLikes: true,
            _count: true,
          },
        },
        _count: true,
      },
    });

    const commentCount = await this.getCommentCount(id);

    return { ...data, commentCount, curUserLiked: null };
  }

  async findOneByUser(id: number, user: UserType) {
    const data = await this.prisma.article.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true, email: true },
        },
        categories: true,
        comments: {
          where: {
            parentId: null,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
          include: {
            commentLikes: true,
            user: {
              select: { id: true, username: true, avatar: true },
            },
            _count: true,
          },
        },
        _count: true,
      },
    });

    const comments = await this.checkCurUserLikeComment(data.comments, user.id);
    const commentCount = await this.getCommentCount(id);
    const curUserLiked = await this.checkCurUserLike(id, user.id);
    const articleLikeCount = await this.articleLikeCount(id);

    return { ...data, comments, commentCount, curUserLiked, articleLikeCount };
  }

  async addLike(id: string, user: UserType) {
    const existLike = await this.prisma.like.findFirst({
      where: {
        id: +id,
        userId: user.id,
      },
    });
    await sleep(1000);
    if (!existLike) {
      await this.prisma.like.create({
        data: {
          articleId: +id,
          userId: user.id,
        },
      });
      const count = await this.prisma.like.count({
        where: {
          articleId: +id,
        },
      });
      return {
        count,
        success: 'Like article success!',
      };
    }
  }

  async removeLike(id: string, user: UserType) {
    const existLike = await this.prisma.like.findFirst({
      where: {
        articleId: +id,
        userId: user.id,
      },
    });
    await sleep(1000);
    if (!!existLike) {
      await this.prisma.like.delete({
        where: {
          id: +existLike.id,
        },
      });
      const count = await this.prisma.like.count({
        where: {
          id: +id,
        },
      });
      return {
        count,
        success: 'Unlike article success!',
      };
    }
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

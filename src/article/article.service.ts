import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async create(createArticleDto: CreateArticleDto) {
    return await this.prisma.article.create({
      data: {
        title: createArticleDto.title,
        content: createArticleDto.content,
        categoryId: +createArticleDto.categoryId,
      },
    });
  }

  async findAll(page) {
    const row = +this.config.get('ARTICLE_PAGE_ROW');
    const articles = await this.prisma.article.findMany({
      skip: (page - 1) * row,
      take: row,
    });
    const total = await this.prisma.article.count();
    return {
      meta: {
        current_page: page,
        page_row: row,
        total,
        total_page: Math.ceil(total / row),
      },
      data: articles,
    };
  }

  async findOne(id: number) {
    return await this.prisma.article.findFirst({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    return await this.prisma.article.update({
      where: {
        id,
      },
      data: { ...updateArticleDto, categoryId: +updateArticleDto.categoryId },
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

import { Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from 'src/auth/decorator/user.decorator';
import { user as UserType } from '@prisma/client';
import { DefaultValuePipe } from '@nestjs/common/pipes';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { Policy } from 'src/casl/decorator/policy.decorator';
import { CategoryService } from 'src/category/category.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService, private readonly categoryService: CategoryService) {}

  @Post()
  @Auth()
  create(@Body() createArticleDto: CreateArticleDto, @User() user: UserType) {
    return this.articleService.create(createArticleDto, user);
  }

  @Get()
  async findAll(@Query('page', new DefaultValuePipe(1)) page: number) {
    const { meta, data } = await this.articleService.findAll(page);
    const res = await Promise.all(
      data.map(async (article) => {
        const categories = await this.categoryService.findMany(article.categories);
        return {
          ...article,
          categories,
        };
      }),
    );
    return { meta, data: res };
  }

  @Get('/user')
  @Auth()
  findAllByUser(@Query('page', new DefaultValuePipe(1)) page: number, @User() user: UserType) {
    return this.articleService.findAllByUser(page, user);
  }

  @Get('/userId/:id')
  findAllByUserId(@Query('page', new DefaultValuePipe(1)) page: number, @Param('id') id: string) {
    return this.articleService.findAllByUserId(page, id);
  }

  @Get('/categoryId/:id')
  findAllByCategoryId(@Query('page', new DefaultValuePipe(1)) page: number, @Param('id') id: string) {
    return this.articleService.findAllByCategoryId(page, id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  @Policy({ action: 'update', type: 'article' })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  @Policy({ action: 'delete', type: 'article' })
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}

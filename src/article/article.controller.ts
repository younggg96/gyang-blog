import { Controller, Get, Post, Body, Patch, Param, Query, Delete } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from 'src/auth/decorator/user.decorator';
import { user as UserType } from '@prisma/client';
import { DefaultValuePipe } from '@nestjs/common/pipes';
import { Auth } from 'src/auth/decorator/auth.decorator';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @Auth()
  create(@Body() createArticleDto: CreateArticleDto, @User() user: UserType) {
    return this.articleService.create(createArticleDto, user);
  }

  @Get()
  findAll(@Query('page', new DefaultValuePipe(1)) page: number) {
    return this.articleService.findAll(page);
  }

  @Get('/user')
  @Auth()
  findAllByUserId(@Query('page', new DefaultValuePipe(1)) page: number, @User() user: UserType) {
    return this.articleService.findAllByUserId(page, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}

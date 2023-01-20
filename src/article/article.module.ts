import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { CategoryService } from 'src/category/category.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, CategoryService],
})
export class ArticleModule {}

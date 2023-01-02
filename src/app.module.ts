import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ArticleModule } from './article/article.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ArticleModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

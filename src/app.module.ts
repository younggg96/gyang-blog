import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ArticleModule } from './article/article.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    ArticleModule,
    CategoryModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

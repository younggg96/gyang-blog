import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ArticleModule } from './article/article.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { UploadModule } from './upload/upload.module';
import { CaslModule } from './casl/casl.module';
import { ProfileModule } from './profile/profile.module';
import { MomentModule } from './moment/moment.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    ArticleModule,
    CategoryModule,
    UploadModule,
    CaslModule,
    ProfileModule,
    MomentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

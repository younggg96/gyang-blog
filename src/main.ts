import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import Validate from './common/validate';
import { TransformInterceptor } from './transform.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new Validate());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('api');
  app.useStaticAssets('uploads', { prefix: '/uploads' });
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(3000);
}
bootstrap();

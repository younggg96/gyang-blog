import { PrismaClient } from '@prisma/client';
import { Random } from 'mockjs';
import { create } from '../helper';

export default async () => {
  await create(6, async (prisma: PrismaClient) => {
    return prisma.category.create({
      data: {
        title: Random.title(1, 2),
        articles: {
          create: {
            articleId: Random.integer(1, 10),
          },
        },
      },
    });
  });
};

import { PrismaClient } from '@prisma/client';
import { Random } from 'mockjs';
import { create } from '../helper';

export default async () => {
  await create(20, async (prisma: PrismaClient) => {
    return prisma.category.create({
      data: {
        title: Random.title(1, 2),
      },
    });
  });
};

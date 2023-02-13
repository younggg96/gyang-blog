import { PrismaClient } from '@prisma/client';
import { Random } from 'mockjs';
import { create } from '../helper';

export default async () => {
  await create(50, (prisma: PrismaClient) => {
    return prisma.comment.create({
      data: {
        content: Random.sentence(5, 10),
        userId: Random.integer(1, 11),
        articleId: Random.integer(1, 135),
      },
    });
  });
};

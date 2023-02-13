import { PrismaClient } from '@prisma/client';
import { Random } from 'mockjs';
import { create } from '../helper';

export default async () => {
  await create(40, (prisma: PrismaClient) => {
    return prisma.reply.create({
      data: {
        content: Random.sentence(1, 3),
        userId: Random.integer(1, 11),
        commentId: Random.integer(1, 50),
      },
    });
  });
  await create(20, (prisma: PrismaClient) => {
    return prisma.reply.create({
      data: {
        content: Random.sentence(1, 3),
        userId: Random.integer(1, 11),
        replySelfId: Random.integer(1, 20),
      },
    });
  });
};

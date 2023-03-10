import { PrismaClient } from '@prisma/client';
import { Random } from 'mockjs';
import { create } from '../helper';
import _ from 'lodash';

export default async () => {
  await create(64, async (prisma: PrismaClient) => {
    await prisma.moment.create({
      data: {
        content: Random.paragraph(1, 3),
        userId: Random.integer(1, 11),
      },
    });
  });
  // create imgs
  await create(120, async (prisma: PrismaClient) => {
    await prisma.imgs.create({
      data: {
        url: 'https://source.unsplash.com/random/700x500?sig=' + _.random(1, 1000),
        momentId: Random.integer(1, 54),
      },
    });
  });
  // moment comments
  await create(120, async (prisma: PrismaClient) => {
    await prisma.momentComment.create({
      data: {
        content: Random.paragraph(1, 2),
        userId: Random.integer(1, 11),
        momentId: Random.integer(1, 20),
      },
    });
  });
  // moment likes
  await create(100, async (prisma: PrismaClient) => {
    const momentId = Random.integer(1, 60);
    const userId = Random.integer(1, 11);
    const existLike = await prisma.momentLike.findFirst({
      where: {
        momentId,
        userId,
      },
    });
    if (!existLike) {
      await prisma.momentLike.create({
        data: {
          momentId,
          userId,
        },
      });
    }
  });
};

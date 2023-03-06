import { PrismaClient } from '@prisma/client';
import _ from 'lodash';
import { Random } from 'mockjs';
import { create } from '../helper';

export default async () => {
  await create(64, async (prisma: PrismaClient) => {
    const userId = Random.integer(1, 11);
    const moment = await prisma.moment.create({
      data: {
        content: Random.paragraph(1, 3),
        userId,
      },
    });
    // await prisma.momentLike.create({
    //   data: {
    //     status: false,
    //     momentId: moment.id,
    //     userId,
    //   },
    // });
  });
  // create imgs
  await create(120, async (prisma: PrismaClient) => {
    prisma.imgs.create({
      data: {
        url: 'https://source.unsplash.com/random/700x500?sig=' + _.random(1, 1000),
        momentId: Random.integer(1, 54),
      },
    });
  });
  // moment comments
  await create(120, async (prisma: PrismaClient) => {
    prisma.momentComment.create({
      data: {
        content: Random.paragraph(1, 2),
        userId: Random.integer(1, 11),
        momentId: Random.integer(1, 20),
      },
    });
  });
  // // moment likes
  // await create(10, async (prisma: PrismaClient) => {
  //   const momentId = Random.integer(1, 60);
  //   const userId = Random.integer(1, 11);
  //   const moment = await prisma.momentLike.findFirst({
  //     where: { momentId, userId },
  //   });
  //   if (!!moment && !moment.status) {
  //     await prisma.momentLike.create({
  //       data: {
  //         status: true,
  //         momentId,
  //         userId,
  //       },
  //     });
  //   }
  // });
};

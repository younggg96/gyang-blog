import { PrismaClient } from '@prisma/client';
import _ from 'lodash';
import { Random } from 'mockjs';
import { create } from '../helper';

export default async () => {
  await create(10, async (prisma: PrismaClient) => {
    return prisma.article.create({
      data: {
        title: Random.title(3, 5),
        img: 'https://source.unsplash.com/random/1280x960?sig=' + _.random(1, 10),
        content: Random.paragraph(1, 3),
        userId: Random.integer(1, 11),
        published: false,
      },
    });
  });
};

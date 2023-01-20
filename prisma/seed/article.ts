import { PrismaClient } from '@prisma/client';
import _ from 'lodash';
import { Random } from 'mockjs';
import { create } from '../helper';

export default async () => {
  await create(135, async (prisma: PrismaClient) => {
    return prisma.article.create({
      data: {
        title: Random.title(3, 5),
        img: 'https://source.unsplash.com/random/1280x960?sig=' + _.random(1, 20),
        content: Random.paragraph(1, 8),
        userId: Random.integer(1, 11),
        published: false,
      },
    });
  });
};

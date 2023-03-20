import { PrismaClient } from '@prisma/client';
import _ from 'lodash';
import { Random } from 'mockjs';
import { create } from '../helper';

export default async () => {
  await create(135, async (prisma: PrismaClient) => {
    return prisma.article.create({
      data: {
        title: Random.title(3, 5),
        img: 'https://source.unsplash.com/random/1280x960?sig=' + _.random(1, 100),
        description: Random.paragraph(1, 2),
        content: Random.paragraph(50, 100),
        user: { connect: { id: Random.integer(1, 11) } },
        published: true,
      },
    });
  });
};

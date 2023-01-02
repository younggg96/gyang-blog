import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import _ from 'lodash';
import { Random } from 'mockjs';

const prisma = new PrismaClient();
async function run() {
  await prisma.user.create({
    data: {
      name: 'admin',
      password: await hash('admin888'),
    },
  });

  for (let i = 1; i <= 5; i++) {
    await prisma.category.create({
      data: {
        title: Random.title(3, 5),
      },
    });
  }

  for (let i = 0; i < 50; i++) {
    await prisma.article.create({
      data: {
        title: Random.title(3, 5),
        content: Random.paragraph(1, 3),
        categoryId: _.random(1, 5),
      },
    });
  }
}

run();

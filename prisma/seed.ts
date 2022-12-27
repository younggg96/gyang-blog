import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import { Random } from 'mockjs';

const prisma = new PrismaClient();
async function run() {
  await prisma.user.create({
    data: {
      name: 'admin',
      password: await hash('admin888'),
    },
  });

  for (let i = 0; i < 50; i++) {
    await prisma.article.create({
      data: {
        title: Random.title(3, 5),
        content: Random.paragraph(1, 3),
      },
    });
  }
}

run();

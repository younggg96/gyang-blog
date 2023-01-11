import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import { Random } from 'mockjs';
import { create } from '../helper';

const prisma = new PrismaClient();
export default async () => {
  await prisma.user.create({
    data: {
      username: 'yang',
      email: 'yang960123@gmail.com',
      password: await hash('admin888'),
      role: 'admin',
      avatar: 'https://i.pravatar.cc/150?img=' + Random.integer(1, 50),
    },
  });
  await create(10, async (prisma: PrismaClient) => {
    return prisma.user.create({
      data: {
        username: Random.title(1, 2),
        email: Random.email('gamil.com'),
        password: await hash('admin888'),
        role: 'user',
        avatar: 'https://i.pravatar.cc/150?img=' + Random.integer(1, 50),
      },
    });
  });
};

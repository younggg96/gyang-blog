import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import { Random } from 'mockjs';
import { create } from '../helper';

const prisma = new PrismaClient();

const createAdmin = async () => {
  await prisma.user.create({
    data: {
      email: 'yang960123@gmail.com',
      username: 'yang',
      password: await hash('admin888'),
      avatar: 'https://i.pravatar.cc/150?img=' + Random.integer(1, 50),
      role: 'admin',
    },
  });
  await prisma.profile.create({
    data: {
      backgroundImg:
        'https://images.unsplash.com/photo-1676085272653-5e77875eed3d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80',
      bio: Random.sentence(3, 8),
      github: Random.url(),
      linkedin: Random.url(),
      facebook: Random.url(),
      userEmail: 'yang960123@gmail.com',
    },
  });
};

const createUsers = async (count) => {
  await create(count, async (prisma: PrismaClient) => {
    const email = Random.email('gamil.com');
    await prisma.user.create({
      data: {
        username: Random.title(1, 2),
        email: email,
        password: await hash('admin888'),
        avatar: 'https://i.pravatar.cc/150?img=' + Random.integer(1, 50),
        role: 'user',
      },
    });
    await prisma.profile.create({
      data: {
        backgroundImg:
          'https://images.unsplash.com/photo-1676085272653-5e77875eed3d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80',
        bio: Random.sentence(3, 8),
        github: Random.url(),
        linkedin: Random.url(),
        facebook: Random.url(),
        userEmail: email,
      },
    });
  });
};

export default async () => {
  await createAdmin();
  await createUsers(10);
};

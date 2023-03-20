import { PrismaClient } from '@prisma/client';
import { Random } from 'mockjs';
import { create } from '../helper';

export default async () => {
  await create(135, async (prisma: PrismaClient) => {
    const articleId = Random.integer(1, 135);
    for (let index = 0; index < 5; index++) {
      const pComment = await prisma.comment.create({
        data: {
          content: Random.paragraph(1, 2),
          user: { connect: { id: Random.integer(1, 11) } },
          article: { connect: { id: articleId } },
        },
      });
      const siblingComment = await prisma.comment.create({
        data: {
          content: Random.sentence(2, 6),
          user: { connect: { id: Random.integer(1, 11) } },
          article: { connect: { id: articleId } },
          parent: { connect: { id: pComment.id } },
        },
      });
      await prisma.comment.create({
        data: {
          content: Random.sentence(2, 6),
          user: { connect: { id: Random.integer(1, 11) } },
          article: { connect: { id: articleId } },
          parent: { connect: { id: pComment.id } },
          replyTo: siblingComment.id,
        },
      });
    }
  });
};

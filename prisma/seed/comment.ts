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
  await create(100, async (prisma: PrismaClient) => {
    const commentId = Random.integer(1, 500);
    const userId = Random.integer(1, 11);
    const existLike = await prisma.commentLike.findFirst({
      where: {
        commentId,
        userId,
      },
    });
    if (!existLike) {
      await prisma.commentLike.create({
        data: {
          commentId,
          userId,
        },
      });
    }
  });
};

import { PureAbility, AbilityBuilder } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { article, user } from '@prisma/client';

type AppAbility = PureAbility<
  [
    string,
    Subjects<{
      article: article;
    }>,
  ],
  PrismaQuery
>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: user) {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);
    can('update', 'article', { userId: user.id });
    can('delete', 'article', { userId: user.id });
    return build();
  }
}

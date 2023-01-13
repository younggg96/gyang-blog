import { CanActivate, ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { POLICY_CONFIG, POLICY_KEY } from './config';
import { Role } from 'src/auth/guards/role/config';

import { subject } from '@casl/ability';
import { ConfigType } from '@nestjs/config';
import { policy } from 'src/config/policy';

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    @Inject(policy.KEY) private policyConfig: ConfigType<typeof policy>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //获取聚合装饰器中的元信息
    const { action, type } = this.reflector.get<POLICY_CONFIG>(POLICY_KEY, context.getHandler());
    //得到当前登录用户
    const { user, params } = context.switchToHttp().getRequest();
    console.log(user, params, action, type);
    //管理员直接通过验证
    if (user.role == Role.ADMIN) return true;
    //从配置文件config/policy中获取策略
    const build = this.policyConfig[type].createForUser(user);

    //如果当前请求有id字段，则查找模型用于验证
    if (params.id) {
      const model = await this.prisma.article.findUnique({ where: { id: +params.id } });
      return build.can(action, subject(type, model));
    }

    //针对没有id的操作验证，比如查看文章等动作
    return build.can(action, type);
  }
}

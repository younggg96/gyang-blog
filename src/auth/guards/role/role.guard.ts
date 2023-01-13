import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { user } from '@prisma/client';
import { Observable } from 'rxjs';
import { ROLE_KEY, Role } from './config';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const user = context.switchToHttp().getRequest().user as user;
    const roles = this.reflector.getAllAndMerge<Role[]>(ROLE_KEY, [context.getHandler(), context.getClass()]);
    return roles.length ? roles.some((role) => user.role === role) : true;
  }
}

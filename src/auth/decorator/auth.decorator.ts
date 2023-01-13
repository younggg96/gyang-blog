import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLE_KEY, Role } from '../guards/role/config';
import { RoleGuard } from '../guards/role/role.guard';

export function Auth(...roles: Role[]) {
  return applyDecorators(SetMetadata(ROLE_KEY, roles), UseGuards(AuthGuard('jwt'), RoleGuard));
}

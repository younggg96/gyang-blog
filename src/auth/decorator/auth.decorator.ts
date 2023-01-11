import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../enum';
import { RoleGuard } from '../guards/role/role.guard';

export function Auth(...roles: Role[]) {
  console.log(roles);
  return applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard('jwt'), RoleGuard));
}

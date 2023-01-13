import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { POLICY_CONFIG, POLICY_KEY } from '../guard/config';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { PolicyGuard } from '../guard/policy.guard';

export function Policy(policy: POLICY_CONFIG) {
  return applyDecorators(Auth(), SetMetadata(POLICY_KEY, policy), UseGuards(PolicyGuard));
}

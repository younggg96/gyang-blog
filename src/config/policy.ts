import { registerAs } from '@nestjs/config';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';

export const policy = registerAs('policy', () => {
  return {
    article: new CaslAbilityFactory(),
  };
});

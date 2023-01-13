import { registerAs } from '@nestjs/config';
export const app = registerAs('app', () => ({
  name: process.env.APP_NAME || 'code fish',
  token_access: process.env.TOKEN_SECRET || '',
  mobile: process.env.MOBILE || '',
  is_dev: process.env.NODE_ENV == 'development',
}));

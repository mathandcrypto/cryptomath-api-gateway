import { registerAs } from '@nestjs/config';
import { AppConfig } from './interfaces/app-config.interface';

export default registerAs<AppConfig>('app', () => ({
  env: process.env.APP_ENV,
  url: process.env.APP_URL,
  port: Number(process.env.APP_PORT),
}));

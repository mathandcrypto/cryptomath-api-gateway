import { registerAs } from '@nestjs/config';
import { CaptchaConfig } from './interfaces/captcha-config.interface';

export default registerAs<CaptchaConfig>('captcha', () => ({
  protoFile: process.env.CAPTCHA_SERVICE_PROTO_FILE,
  url: process.env.CAPTCHA_SERVICE_URL,
  tokenSecret: process.env.JWT_CAPTCHA_TOKEN_SECRET,
  tokenExpirationTime: process.env.JWT_CAPTCHA_TOKEN_EXPIRATION_TIME,
}));

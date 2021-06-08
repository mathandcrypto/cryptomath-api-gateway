import { registerAs } from '@nestjs/config';

export default registerAs('captcha', () => ({
  protoFile: process.env.CAPTCHA_SERVICE_PROTO_FILE,
  url: process.env.CAPTCHA_SERVICE_URL,
  captchaTokenSecret: process.env.JWT_CAPTCHA_TOKEN_SECRET,
  captchaTokenExpirationTime: process.env.JWT_CAPTCHA_TOKEN_EXPIRATION_TIME,
}));

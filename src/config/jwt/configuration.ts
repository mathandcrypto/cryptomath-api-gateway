import { registerAs } from '@nestjs/config';
import { JwtConfig } from './interfaces/jwt-config.interface';

export default registerAs<JwtConfig>('jwt', () => ({
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  accessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  refreshTokenExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
}));

import { registerAs } from '@nestjs/config';
import { AuthConfig } from './interfaces/auth-config.interface';

export default registerAs<AuthConfig>('auth', () => ({
  protoFile: process.env.AUTH_SERVICE_PROTO_FILE,
  url: process.env.AUTH_SERVICE_URL,
}));

import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  protoFile: process.env.AUTH_SERVICE_PROTO_FILE,
  url: process.env.AUTH_SERVICE_URL,
}));

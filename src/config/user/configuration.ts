import { registerAs } from '@nestjs/config';

export default registerAs('user', () => ({
  protoFile: process.env.USER_SERVICE_PROTO_FILE,
  url: process.env.USER_SERVICE_URL,
}));

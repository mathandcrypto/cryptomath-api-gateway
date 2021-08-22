import { registerAs } from '@nestjs/config';
import { UserConfig } from './interfaces/user-config.interface';

export default registerAs<UserConfig>('user', () => ({
  protoFile: process.env.USER_SERVICE_PROTO_FILE,
  url: process.env.USER_SERVICE_URL,
}));

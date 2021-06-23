import { registerAs } from '@nestjs/config';

export default registerAs('articles', () => ({
  protoFile: process.env.ARTICLES_SERVICE_PROTO_FILE,
  url: process.env.ARTICLES_SERVICE_URL,
}));

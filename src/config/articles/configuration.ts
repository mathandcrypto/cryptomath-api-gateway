import { registerAs } from '@nestjs/config';
import { ArticlesConfig } from './interfaces/articles-config.interface';

export default registerAs<ArticlesConfig>('articles', () => ({
  protoFile: process.env.ARTICLES_SERVICE_PROTO_FILE,
  url: process.env.ARTICLES_SERVICE_URL,
}));

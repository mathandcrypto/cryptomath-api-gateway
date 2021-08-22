import { registerAs } from '@nestjs/config';
import { SearchConfig } from './interfaces/search-config.interface';

export default registerAs<SearchConfig>('search', () => ({
  protoFile: process.env.SEARCH_SERVICE_PROTO_FILE,
  url: process.env.SEARCH_SERVICE_URL,
}));

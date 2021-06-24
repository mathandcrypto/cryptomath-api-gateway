import { Tag } from 'cryptomath-api-proto/types/articles';

export interface TagsList {
  tags: Tag[];
  limit: number;
  total: number;
}

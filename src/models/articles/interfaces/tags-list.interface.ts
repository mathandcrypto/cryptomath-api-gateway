import { Tag } from '@cryptomath/cryptomath-api-proto/types/articles';
import { BaseList } from '@common/interfaces/response/base-list.interface';

export interface TagsList extends BaseList {
  tags: Tag[];
}

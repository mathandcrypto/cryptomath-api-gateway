import { SortOrder } from '@common/enums/sort-order.enum';

export interface TagsSortsQuery {
  name: SortOrder;
  articles: SortOrder;
}

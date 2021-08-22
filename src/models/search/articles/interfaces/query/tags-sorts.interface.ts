import { SortOrder } from '@common/enums/sort-order.enum';

export interface SearchArticlesTagsSortsQuery {
  name: SortOrder;
  articles: SortOrder;
}

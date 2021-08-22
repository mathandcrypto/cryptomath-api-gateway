import { SortOrder } from '@common/enums/sort-order.enum';

export interface SearchArticlesHubsSortsQuery {
  name: SortOrder;
  articles: SortOrder;
  tags: SortOrder;
}

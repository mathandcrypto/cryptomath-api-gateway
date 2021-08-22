import { SortOrder } from '@common/enums/sort-order.enum';

export interface HubsSortsQuery {
  name: SortOrder;
  articles: SortOrder;
  tags: SortOrder;
}

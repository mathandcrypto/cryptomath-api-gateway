import { SortOrder } from '@common/enums/sort-order.enum';

export interface ArticlesSortsQuery {
  title: SortOrder;
  comments: SortOrder;
  rating: SortOrder;
  created_at: SortOrder;
}

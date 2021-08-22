import { NumericRangeQuery } from '@common/interfaces/request/query/numeric-range.interface';
import { DateTimeRangeQuery } from '@common/interfaces/request/query/date-time-range.interface';

export interface ArticlesFiltersQuery {
  id?: number;
  title?: string;
  user_id?: number;
  hubs?: number[];
  tags?: number[];
  comments?: NumericRangeQuery;
  rating?: NumericRangeQuery;
  created_at?: DateTimeRangeQuery;
}

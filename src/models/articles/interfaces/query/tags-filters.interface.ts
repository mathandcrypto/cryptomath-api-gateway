import { NumericRangeQuery } from '@common/interfaces/request/query/numeric-range.interface';

export interface TagsFiltersQuery {
  id?: number;
  name?: string;
  hub_id?: number;
  articles?: NumericRangeQuery;
}

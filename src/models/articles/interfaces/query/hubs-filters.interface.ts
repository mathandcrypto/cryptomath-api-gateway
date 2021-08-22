import { NumericRangeQuery } from '@common/interfaces/request/query/numeric-range.interface';

export interface HubsFiltersQuery {
  id?: number;
  name?: string;
  tags_list?: number[];
  articles?: NumericRangeQuery;
  tags?: NumericRangeQuery;
}

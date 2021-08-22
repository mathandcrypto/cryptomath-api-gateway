import { NumericRangeQuery } from '@common/interfaces/request/query/numeric-range.interface';

export interface SearchArticlesTagsFiltersQuery {
  hub_id?: number;
  articles?: NumericRangeQuery;
}

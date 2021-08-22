import { NumericRangeQuery } from '@common/interfaces/request/query/numeric-range.interface';

export interface SearchArticlesHubsFiltersQuery {
  articles?: NumericRangeQuery;
  tags?: NumericRangeQuery;
}

import { SortOrder } from '@common/enums/sort-order.enum';
import { SortDirection } from 'cryptomath-api-proto/types/sorts';

export const sortOrderToProto = (sortOrder: SortOrder): SortDirection => {
  return sortOrder === SortOrder.Desc ? SortDirection.DESC : SortDirection.ASC;
};

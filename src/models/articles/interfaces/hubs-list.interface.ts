import { Hub } from '@cryptomath/cryptomath-api-proto/types/articles';
import { BaseList } from '@common/interfaces/response/base-list.interface';

export interface HubsList extends BaseList {
  hubs: Hub[];
}

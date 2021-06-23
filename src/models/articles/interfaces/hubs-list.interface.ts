import { Hub } from 'cryptomath-api-proto/types/articles';

export interface HubsList {
  hubs: Hub[];
  limit: number;
  total: number;
}

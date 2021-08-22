import { Hub } from '@cryptomath/cryptomath-api-proto/types/articles';
import { SearchList } from '@models/search/interfaces/search-list.interface';
import { SearchHit } from '@models/search/interfaces/search-hit.interface';

export interface SearchArticlesHubsList extends SearchList {
  hubs: Array<SearchHit<Hub>>;
}

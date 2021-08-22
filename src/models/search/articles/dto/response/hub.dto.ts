import { SearchHitResponseDTO } from '@models/search/dto/response/search-hit.dto';
import { HubResponseDTO } from '@models/articles/dto/response/hub.dto';

export class SearchArticlesHubResponseDTO extends SearchHitResponseDTO {
  data: HubResponseDTO;
}

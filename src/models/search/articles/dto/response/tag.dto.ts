import { SearchHitResponseDTO } from '@models/search/dto/response/search-hit.dto';
import { TagResponseDTO } from '@models/articles/dto/response/tag.dto';

export class SearchArticlesTagResponseDTO extends SearchHitResponseDTO {
  data: TagResponseDTO;
}

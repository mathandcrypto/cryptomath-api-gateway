import { SearchHitResponseDTO } from '@models/search/dto/response/search-hit.dto';
import { HubResponseDTO } from '@models/articles/dto/response/hub.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SearchArticlesHubResponseDTO extends SearchHitResponseDTO {
  @ApiProperty()
  data: HubResponseDTO;
}

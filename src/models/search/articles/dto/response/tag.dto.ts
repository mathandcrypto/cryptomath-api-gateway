import { SearchHitResponseDTO } from '@models/search/dto/response/search-hit.dto';
import { TagResponseDTO } from '@models/articles/dto/response/tag.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SearchArticlesTagResponseDTO extends SearchHitResponseDTO {
  @ApiProperty()
  data: TagResponseDTO;
}

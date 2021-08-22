import { SearchListResponseDTO } from '@models/search/dto/response/search-list.dto';
import { SearchArticlesHubResponseDTO } from './hub.dto';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchArticlesHubsListResponseDTO extends SearchListResponseDTO {
  @ApiProperty({ type: [SearchArticlesHubResponseDTO] })
  @IsArray()
  @Type(() => SearchArticlesHubResponseDTO)
  hubs: SearchArticlesHubResponseDTO[];
}

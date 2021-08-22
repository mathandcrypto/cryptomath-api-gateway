import { SearchListResponseDTO } from '@models/search/dto/response/search-list.dto';
import { SearchArticlesTagResponseDTO } from './tag.dto';
import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchArticlesTagsListResponseDTO extends SearchListResponseDTO {
  @ApiProperty({ type: [SearchArticlesTagResponseDTO] })
  @IsArray()
  @Type(() => SearchArticlesTagResponseDTO)
  tags: SearchArticlesTagResponseDTO[];
}

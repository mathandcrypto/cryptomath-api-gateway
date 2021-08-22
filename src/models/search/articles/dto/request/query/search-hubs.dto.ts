import { BaseSearchQueryDTO } from '@models/search/dto/request/query/base-search.dto';
import { IsOptional, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { NumericIntRangeQueryDTO } from '@common/dto/request/query/numeric-int-range.dto';
import { SearchArticlesHubsSortsQueryDTO } from './hubs-sorts.dto';
import {
  transformToNumericRange,
  transformToSorts,
} from '@common/helpers/transform';

export class SearchArticlesHubsQueryDTO extends BaseSearchQueryDTO {
  @IsOptional()
  @Type(() => NumericIntRangeQueryDTO)
  @Transform(
    ({ value }) => new NumericIntRangeQueryDTO(transformToNumericRange(value)),
  )
  @ValidateNested({ each: true })
  articles: NumericIntRangeQueryDTO;

  @IsOptional()
  @Type(() => NumericIntRangeQueryDTO)
  @Transform(
    ({ value }) => new NumericIntRangeQueryDTO(transformToNumericRange(value)),
  )
  @ValidateNested({ each: true })
  tags: NumericIntRangeQueryDTO;

  @IsOptional()
  @Type(() => SearchArticlesHubsSortsQueryDTO)
  @Transform(
    ({ value }) => new SearchArticlesHubsSortsQueryDTO(transformToSorts(value)),
  )
  @ValidateNested({ each: true })
  sorts: SearchArticlesHubsSortsQueryDTO;
}

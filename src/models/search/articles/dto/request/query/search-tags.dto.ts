import { BaseSearchQueryDTO } from '@models/search/dto/request/query/base-search.dto';
import { IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { NumericIntRangeQueryDTO } from '@common/dto/request/query/numeric-int-range.dto';
import { SearchArticlesTagsSortsQueryDTO } from './tags-sorts.dto';
import {
  transformToNumericRange,
  transformToSorts,
} from '@common/helpers/transform';

export class SearchArticlesTagsQueryDTO extends BaseSearchQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  hub_id: number;

  @IsOptional()
  @Type(() => NumericIntRangeQueryDTO)
  @Transform(
    ({ value }) => new NumericIntRangeQueryDTO(transformToNumericRange(value)),
  )
  @ValidateNested({ each: true })
  articles: NumericIntRangeQueryDTO;

  @IsOptional()
  @Type(() => SearchArticlesTagsSortsQueryDTO)
  @Transform(
    ({ value }) => new SearchArticlesTagsSortsQueryDTO(transformToSorts(value)),
  )
  @ValidateNested({ each: true })
  sorts: SearchArticlesTagsSortsQueryDTO;
}

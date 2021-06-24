import { PaginationQueryDTO } from '@common/dto/request/query/pagination.dto';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  transformToNumericRange,
  transformToSorts,
} from '@common/helpers/transform';
import { NumericIntRangeQueryDTO } from '@common/dto/request/query/numeric-int-range.dto';
import { TagsSortsQueryDTO } from './tags-sorts.dto';

export class GetTagsQueryDTO extends PaginationQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

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
  @Type(() => TagsSortsQueryDTO)
  @Transform(({ value }) => new TagsSortsQueryDTO(transformToSorts(value)))
  @ValidateNested({ each: true })
  sorts: TagsSortsQueryDTO;
}

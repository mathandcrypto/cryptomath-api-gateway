import { PaginationQueryDTO } from '@common/dto/request/query/pagination.dto';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  transformToArrayOfNumbers,
  transformToNumericRange,
  transformToSorts,
} from '@common/helpers/transform';
import { NumericIntRangeQueryDTO } from '@common/dto/request/query/numeric-int-range.dto';
import { HubsSortsQueryDTO } from './hubs-sorts.dto';

export class GetHubsQueryDTO extends PaginationQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsInt({ each: true })
  @Transform(({ value }) => transformToArrayOfNumbers(value))
  tags_list: number[];

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
  @Type(() => HubsSortsQueryDTO)
  @Transform(({ value }) => new HubsSortsQueryDTO(transformToSorts(value)))
  @ValidateNested({ each: true })
  sorts: HubsSortsQueryDTO;
}

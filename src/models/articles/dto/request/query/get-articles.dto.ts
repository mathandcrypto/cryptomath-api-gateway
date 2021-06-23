import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  transformToArrayOfNumbers,
  transformToDateTimeRange,
  transformToNumericRange,
  transformToSorts,
} from '@common/helpers/transform';
import { NumericIntRangeQueryDTO } from '@common/dto/request/query/numeric-int-range.dto';
import { DateTimeRangeQueryDTO } from '@common/dto/request/query/date-time-range.dto';
import { PaginationQueryDTO } from '@common/dto/request/query/pagination.dto';
import { ArticlesSortsQueryDTO } from './articles-sorts.dto';

export class GetArticlesQueryDTO extends PaginationQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  user_id: number;

  @IsOptional()
  @IsInt({ each: true })
  @Transform(({ value }) => transformToArrayOfNumbers(value))
  hubs: number[];

  @IsOptional()
  @IsInt({ each: true })
  @Transform(({ value }) => transformToArrayOfNumbers(value))
  tags: number[];

  @IsOptional()
  @Type(() => NumericIntRangeQueryDTO)
  @Transform(
    ({ value }) => new NumericIntRangeQueryDTO(transformToNumericRange(value)),
  )
  @ValidateNested({ each: true })
  comments: NumericIntRangeQueryDTO;

  @IsOptional()
  @Type(() => NumericIntRangeQueryDTO)
  @Transform(
    ({ value }) => new NumericIntRangeQueryDTO(transformToNumericRange(value)),
  )
  @ValidateNested({ each: true })
  rating: NumericIntRangeQueryDTO;

  @IsOptional()
  @Type(() => DateTimeRangeQueryDTO)
  @Transform(
    ({ value }) => new DateTimeRangeQueryDTO(transformToDateTimeRange(value)),
  )
  @ValidateNested({ each: true })
  created_at: DateTimeRangeQueryDTO;

  @IsOptional()
  @Type(() => ArticlesSortsQueryDTO)
  @Transform(({ value }) => new ArticlesSortsQueryDTO(transformToSorts(value)))
  @ValidateNested({ each: true })
  sorts: ArticlesSortsQueryDTO;
}

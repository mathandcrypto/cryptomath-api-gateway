import { IsInt, IsOptional } from 'class-validator';
import { NumericRangeQuery } from '@common/interfaces/requests/query/numeric-range.interface';

export class NumericIntRangeQueryDTO implements NumericRangeQuery {
  @IsOptional()
  @IsInt()
  equals: number;

  @IsOptional()
  @IsInt()
  min: number;

  @IsOptional()
  @IsInt()
  max: number;

  constructor(data: Partial<NumericIntRangeQueryDTO>) {
    Object.assign(this, data);
  }
}

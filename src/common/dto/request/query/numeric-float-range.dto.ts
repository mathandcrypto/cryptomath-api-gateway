import { IsNumber, IsOptional } from 'class-validator';
import { NumericRangeQuery } from '@common/interfaces/request/query/numeric-range.interface';

export class NumericFloatRangeQueryDTO implements NumericRangeQuery {
  @IsOptional()
  @IsNumber()
  equals: number;

  @IsOptional()
  @IsNumber()
  min: number;

  @IsOptional()
  @IsNumber()
  max: number;

  constructor(data: Partial<NumericFloatRangeQueryDTO>) {
    Object.assign(this, data);
  }
}

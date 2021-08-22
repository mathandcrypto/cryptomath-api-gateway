import { IsDate, IsOptional } from 'class-validator';
import { DateTimeRangeQuery } from '@common/interfaces/request/query/date-time-range.interface';

export class DateTimeRangeQueryDTO implements DateTimeRangeQuery {
  @IsOptional()
  @IsDate()
  start: Date;

  @IsOptional()
  @IsDate()
  end: Date;

  constructor(data: Partial<DateTimeRangeQueryDTO>) {
    Object.assign(this, data);
  }
}

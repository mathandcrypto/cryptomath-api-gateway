import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit: number;
}

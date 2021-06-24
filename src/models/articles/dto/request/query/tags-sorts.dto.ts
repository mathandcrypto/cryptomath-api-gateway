import { TagsSortsQuery } from '../../../interfaces/tags-sorts-query.interface';
import { IsEnum, IsOptional } from 'class-validator';
import { SortOrder } from '@common/enums/sort-order.enum';

export class TagsSortsQueryDTO implements TagsSortsQuery {
  @IsOptional()
  @IsEnum(SortOrder)
  name: SortOrder = SortOrder.Desc;

  @IsOptional()
  @IsEnum(SortOrder)
  articles: SortOrder = SortOrder.Desc;

  constructor(data: Partial<TagsSortsQueryDTO>) {
    Object.assign(this, data);
  }
}
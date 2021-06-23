import { HubsSortsQuery } from '../../../interfaces/hubs-sorts-query.interface';
import { IsEnum, IsOptional } from 'class-validator';
import { SortOrder } from '@common/enums/sort-order.enum';

export class HubsSortsQueryDTO implements HubsSortsQuery {
  @IsOptional()
  @IsEnum(SortOrder)
  name: SortOrder = SortOrder.Desc;

  @IsOptional()
  @IsEnum(SortOrder)
  articles: SortOrder = SortOrder.Desc;

  @IsOptional()
  @IsEnum(SortOrder)
  tags: SortOrder = SortOrder.Desc;

  constructor(data: Partial<HubsSortsQueryDTO>) {
    Object.assign(this, data);
  }
}
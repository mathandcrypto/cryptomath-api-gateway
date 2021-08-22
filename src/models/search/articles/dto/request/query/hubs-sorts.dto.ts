import { IsEnum, IsOptional } from 'class-validator';
import { SortOrder } from '@common/enums/sort-order.enum';
import { SearchArticlesHubsSortsQuery } from '@models/search/articles/interfaces/query/hubs-sorts.interface';

export class SearchArticlesHubsSortsQueryDTO
  implements SearchArticlesHubsSortsQuery
{
  @IsOptional()
  @IsEnum(SortOrder)
  name: SortOrder = SortOrder.Desc;

  @IsOptional()
  @IsEnum(SortOrder)
  articles: SortOrder = SortOrder.Desc;

  @IsOptional()
  @IsEnum(SortOrder)
  tags: SortOrder = SortOrder.Desc;

  constructor(data: Partial<SearchArticlesHubsSortsQueryDTO>) {
    Object.assign(this, data);
  }
}

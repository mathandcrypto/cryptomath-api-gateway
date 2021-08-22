import { IsEnum, IsOptional } from 'class-validator';
import { SortOrder } from '@common/enums/sort-order.enum';
import { SearchArticlesTagsSortsQuery } from '@models/search/articles/interfaces/query/tags-sorts.interface';

export class SearchArticlesTagsSortsQueryDTO
  implements SearchArticlesTagsSortsQuery
{
  @IsOptional()
  @IsEnum(SortOrder)
  name: SortOrder = SortOrder.Desc;

  @IsOptional()
  @IsEnum(SortOrder)
  articles: SortOrder = SortOrder.Desc;

  constructor(data: Partial<SearchArticlesTagsSortsQueryDTO>) {
    Object.assign(this, data);
  }
}

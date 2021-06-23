import { IsEnum, IsOptional } from 'class-validator';
import { SortOrder } from '@common/enums/sort-order.enum';
import { ArticlesSortsQuery } from '../../../interfaces/articles-sorts-query.interface';

export class ArticlesSortsQueryDTO implements ArticlesSortsQuery {
  @IsOptional()
  @IsEnum(SortOrder)
  title: SortOrder = SortOrder.Desc;

  @IsOptional()
  @IsEnum(SortOrder)
  comments: SortOrder = SortOrder.Desc;

  @IsOptional()
  @IsEnum(SortOrder)
  rating: SortOrder = SortOrder.Desc;

  @IsOptional()
  @IsEnum(SortOrder)
  created_at: SortOrder = SortOrder.Desc;

  constructor(data: Partial<ArticlesSortsQueryDTO>) {
    Object.assign(this, data);
  }
}

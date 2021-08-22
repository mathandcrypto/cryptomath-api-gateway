import { ArticleExtra } from './article-extra.interface';
import { BaseList } from '@common/interfaces/response/base-list.interface';

export interface ArticlesList extends BaseList {
  articles: ArticleExtra[];
}

import { ArticleExtra } from './article-extra.interface';

export interface ArticlesList {
  articles: ArticleExtra[];
  limit: number;
  total: number;
}

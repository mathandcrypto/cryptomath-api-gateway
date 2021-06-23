import { Article } from 'cryptomath-api-proto/types/articles';
import { User } from 'cryptomath-api-proto/types/user';

export interface ArticleExtra extends Article {
  user: User;
}

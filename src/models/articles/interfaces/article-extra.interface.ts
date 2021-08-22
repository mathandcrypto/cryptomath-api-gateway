import { Article } from '@cryptomath/cryptomath-api-proto/types/articles';
import { User } from '@cryptomath/cryptomath-api-proto/types/user';

export interface ArticleExtra extends Article {
  user: User;
}

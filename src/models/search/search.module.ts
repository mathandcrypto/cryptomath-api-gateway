import { Module } from '@nestjs/common';
import { SearchArticlesModule } from './articles/articles.module';

@Module({
  imports: [SearchArticlesModule],
})
export class SearchModule {}

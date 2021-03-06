import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  ARTICLES_PACKAGE_NAME,
  ARTICLES_SERVICE_NAME,
  ArticlesServiceClient,
  ArticlesFilters,
  ArticlesSorts,
  FindArticlesResponse,
} from '@cryptomath/cryptomath-api-proto/types/articles';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ArticlesPackageService implements OnModuleInit {
  private readonly logger = new Logger(ArticlesPackageService.name);
  private client: ArticlesServiceClient;

  constructor(@Inject(ARTICLES_PACKAGE_NAME) private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.client = this.clientGrpc.getService<ArticlesServiceClient>(
      ARTICLES_SERVICE_NAME,
    );
  }

  async findArticles(
    filters: ArticlesFilters,
    sorts: ArticlesSorts,
    offset: number,
    limit: number,
  ): Promise<[boolean, FindArticlesResponse]> {
    try {
      const observable = this.client.findArticles({
        filters,
        sorts,
        offset,
        limit,
      });
      const response = await firstValueFrom<FindArticlesResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }
}

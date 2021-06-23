import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  ARTICLES_PACKAGE_NAME,
  ARTICLES_SERVICE_NAME,
  ArticlesServiceClient,
  ArticlesFilters,
  ArticlesSorts,
  FindArticlesResponse,
  HubsFilters,
  HubsSorts,
  FindHubsResponse,
} from 'cryptomath-api-proto/types/articles';
import { ClientGrpc } from '@nestjs/microservices';

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
      const response = await this.client
        .findArticles({ filters, sorts, offset, limit })
        .toPromise();

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async findHubs(
    filters: HubsFilters,
    sorts: HubsSorts,
    offset: number,
    limit: number,
  ): Promise<[boolean, FindHubsResponse]> {
    try {
      const response = await this.client
        .findHubs({ filters, sorts, offset, limit })
        .toPromise();

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }
}

import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  SEARCH_PACKAGE_NAME,
  SEARCH_ARTICLES_SERVICE_NAME,
  SearchArticlesServiceClient,
  HubsFilters,
  HubsSorts,
  TagsFilters,
  TagsSorts,
  SearchHubsResponse,
  SearchTagsResponse,
} from '@cryptomath/cryptomath-api-proto/types/search';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SearchArticlesPackageService implements OnModuleInit {
  private readonly logger = new Logger(SearchArticlesPackageService.name);
  private client: SearchArticlesServiceClient;

  constructor(@Inject(SEARCH_PACKAGE_NAME) private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.client = this.clientGrpc.getService<SearchArticlesServiceClient>(
      SEARCH_ARTICLES_SERVICE_NAME,
    );
  }

  async searchHubs(
    query: string,
    filters: HubsFilters,
    sorts: HubsSorts,
    offset = 0,
    limit = 30,
  ): Promise<[boolean, SearchHubsResponse]> {
    try {
      const observable = this.client.searchHubs({
        query,
        filters,
        sorts,
        offset,
        limit,
      });
      const response = await firstValueFrom<SearchHubsResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async searchTags(
    query: string,
    filters: TagsFilters,
    sorts: TagsSorts,
    offset = 0,
    limit = 30,
  ): Promise<[boolean, SearchTagsResponse]> {
    try {
      const observable = this.client.searchTags({
        query,
        filters,
        sorts,
        offset,
        limit,
      });
      const response = await firstValueFrom<SearchTagsResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }
}

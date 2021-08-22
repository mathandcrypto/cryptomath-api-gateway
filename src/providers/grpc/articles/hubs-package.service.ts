import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  ARTICLES_PACKAGE_NAME,
  HUBS_SERVICE_NAME,
  HubsServiceClient,
  HubsFilters,
  HubsSorts,
  FindHubsResponse,
  FindHubsFromListResponse,
  FindHubResponse,
  CreateHubResponse,
} from '@cryptomath/cryptomath-api-proto/types/articles';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HubsPackageService implements OnModuleInit {
  private readonly logger = new Logger(HubsPackageService.name);
  private client: HubsServiceClient;

  constructor(@Inject(ARTICLES_PACKAGE_NAME) private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.client =
      this.clientGrpc.getService<HubsServiceClient>(HUBS_SERVICE_NAME);
  }

  async findHubs(
    filters: HubsFilters,
    sorts: HubsSorts,
    offset: number,
    limit: number,
  ): Promise<[boolean, FindHubsResponse]> {
    try {
      const observable = this.client.findHubs({
        filters,
        sorts,
        offset,
        limit,
      });
      const response = await firstValueFrom<FindHubsResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async findHubsFromList(
    idList: number[],
  ): Promise<[boolean, FindHubsFromListResponse]> {
    try {
      const observable = this.client.findHubsFromList({ idList });
      const response = await firstValueFrom<FindHubsFromListResponse>(
        observable,
      );

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async findHub(hubId: number): Promise<[boolean, FindHubResponse]> {
    try {
      const observable = this.client.findHub({ hubId });
      const response = await firstValueFrom<FindHubResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async createHub(
    name: string,
    description: string,
  ): Promise<[boolean, CreateHubResponse]> {
    try {
      const observable = this.client.creteHub({ name, description });
      const response = await firstValueFrom<CreateHubResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }
}

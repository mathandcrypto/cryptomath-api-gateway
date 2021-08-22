import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  ARTICLES_PACKAGE_NAME,
  TAGS_SERVICE_NAME,
  TagsServiceClient,
  TagsFilters,
  TagsSorts,
  FindTagsResponse,
  FindTagResponse,
  FindTagsFromListResponse,
  CreateTagResponse,
} from '@cryptomath/cryptomath-api-proto/types/articles';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TagsPackageService implements OnModuleInit {
  private readonly logger = new Logger(TagsPackageService.name);
  private client: TagsServiceClient;

  constructor(@Inject(ARTICLES_PACKAGE_NAME) private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.client =
      this.clientGrpc.getService<TagsServiceClient>(TAGS_SERVICE_NAME);
  }

  async findTags(
    filters: TagsFilters,
    sorts: TagsSorts,
    offset: number,
    limit: number,
  ): Promise<[boolean, FindTagsResponse]> {
    try {
      const observable = this.client.findTags({
        filters,
        sorts,
        offset,
        limit,
      });
      const response = await firstValueFrom<FindTagsResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async findTag(tagId: number): Promise<[boolean, FindTagResponse]> {
    try {
      const observable = this.client.findTag({ tagId });
      const response = await firstValueFrom<FindTagResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async findTagsFromList(
    idList: number[],
  ): Promise<[boolean, FindTagsFromListResponse]> {
    try {
      const observable = this.client.findTagsFromList({ idList });
      const response = await firstValueFrom<FindTagsFromListResponse>(
        observable,
      );

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async createTag(
    hubId: number,
    name: string,
    description: string,
  ): Promise<[boolean, CreateTagResponse]> {
    try {
      const observable = this.client.createTag({ hubId, name, description });
      const response = await firstValueFrom<CreateTagResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }
}

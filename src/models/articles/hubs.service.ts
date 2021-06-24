import { Injectable } from '@nestjs/common';
import { ArticlesPackageService } from '@providers/grpc/articles/articles-package.service';
import { NumericRangeQuery } from '@common/interfaces/requests/query/numeric-range.interface';
import {
  Hub,
  HubsFilters,
  HubsSorts,
} from 'cryptomath-api-proto/types/articles';
import { HubsSortsQuery } from './interfaces/hubs-sorts-query.interface';
import { FindMultipleError } from './enums/errors/find-multiple.enum';
import { HubsList } from './interfaces/hubs-list.interface';
import { FindOneError } from './enums/errors/find-one.enum';
import { sortOrderToProto } from '@common/helpers/sorts';

@Injectable()
export class HubsService {
  constructor(
    private readonly articlesPackageService: ArticlesPackageService,
  ) {}

  prepareFilters(
    id: number | undefined,
    name: string | undefined,
    tagsList: number[] | undefined,
    articles: NumericRangeQuery | undefined,
    tags: NumericRangeQuery | undefined,
  ): HubsFilters {
    const filters = {} as HubsFilters;

    if (id) {
      filters.id = { id };
    }

    if (name) {
      filters.name = { text: name };
    }

    if (tagsList) {
      filters.tagsList = { idList: tagsList };
    }

    if (articles) {
      filters.articles = {
        equals: articles.equals,
        min: articles.min,
        max: articles.max,
      };
    }

    if (tags) {
      filters.tags = {
        equals: tags.equals,
        min: tags.min,
        max: tags.max,
      };
    }

    return filters;
  }

  prepareSorts(sortsQuery: HubsSortsQuery | undefined): HubsSorts {
    const sorts = {} as HubsSorts;

    if (sortsQuery) {
      if (sortsQuery.name) {
        sorts.name = { direction: sortOrderToProto(sortsQuery.name) };
      }

      if (sortsQuery.articles) {
        sorts.articles = { direction: sortOrderToProto(sortsQuery.articles) };
      }

      if (sortsQuery.tags) {
        sorts.tags = { direction: sortOrderToProto(sortsQuery.tags) };
      }
    }

    return sorts;
  }

  async findMultiple(
    filters: HubsFilters,
    sorts: HubsSorts,
    offset = 0,
    limit = 30,
  ): Promise<[boolean, FindMultipleError, HubsList]> {
    const [
      findHubsStatus,
      findHubsResponse,
    ] = await this.articlesPackageService.findHubs(
      filters,
      sorts,
      offset,
      limit,
    );

    if (!findHubsStatus) {
      return [false, FindMultipleError.FindHubsError, null];
    }

    const { isHubsFound, limit: take, total, hubs } = findHubsResponse;

    if (!isHubsFound) {
      return [false, FindMultipleError.HubsNotFound, null];
    }

    return [
      true,
      null,
      {
        limit: take,
        total,
        hubs: hubs || [],
      },
    ];
  }

  async findOne(hubId: number): Promise<[boolean, FindOneError, Hub]> {
    const [
      findHubStatus,
      findHubResponse,
    ] = await this.articlesPackageService.findHub(hubId);

    if (!findHubStatus) {
      return [false, FindOneError.FindHubError, null];
    }

    const { isHubExists, hub } = findHubResponse;

    if (!isHubExists) {
      return [false, FindOneError.HubNotExists, null];
    }

    return [true, null, hub];
  }
}

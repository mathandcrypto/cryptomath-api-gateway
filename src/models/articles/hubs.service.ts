import { Injectable } from '@nestjs/common';
import { HubsPackageService } from '@providers/grpc/articles/hubs-package.service';
import {
  Hub,
  HubsFilters,
  HubsSorts,
} from '@cryptomath/cryptomath-api-proto/types/articles';
import { HubsFiltersQuery } from './interfaces/query/hubs-filters.interface';
import { HubsSortsQuery } from './interfaces/query/hubs-sorts.interface';
import { FindMultipleError } from './enums/errors/find-multiple.enum';
import { HubsList } from './interfaces/hubs-list.interface';
import { FindOneError } from './enums/errors/find-one.enum';
import { CreateHubError } from './enums/errors/create-hub.error';
import { sortOrderToProto } from '@common/helpers/sorts';

@Injectable()
export class HubsService {
  constructor(private readonly hubsPackageService: HubsPackageService) {}

  prepareFilters(filtersQuery: HubsFiltersQuery): HubsFilters {
    const filters = {} as HubsFilters;

    if (filtersQuery.id) {
      filters.id = { id: filtersQuery.id };
    }

    if (filtersQuery.name) {
      filters.name = { text: filtersQuery.name };
    }

    if (filtersQuery.tags_list) {
      filters.tagsList = { idList: filtersQuery.tags_list };
    }

    if (filtersQuery.articles) {
      const {
        equals: articlesEquals,
        min: articlesMin,
        max: articlesMax,
      } = filtersQuery.articles;

      filters.articles = {
        equals: articlesEquals,
        min: articlesMin,
        max: articlesMax,
      };
    }

    if (filtersQuery.tags) {
      const {
        equals: tagsEquals,
        min: tagsMin,
        max: tagsMax,
      } = filtersQuery.tags;

      filters.tags = {
        equals: tagsEquals,
        min: tagsMin,
        max: tagsMax,
      };
    }

    return filters;
  }

  prepareSorts(sortsQuery?: HubsSortsQuery): HubsSorts {
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
    const [findHubsStatus, findHubsResponse] =
      await this.hubsPackageService.findHubs(filters, sorts, offset, limit);

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
    const [findHubStatus, findHubResponse] =
      await this.hubsPackageService.findHub(hubId);

    if (!findHubStatus) {
      return [false, FindOneError.FindHubError, null];
    }

    const { isHubExists, hub } = findHubResponse;

    if (!isHubExists) {
      return [false, FindOneError.HubNotExists, null];
    }

    return [true, null, hub];
  }

  async createHub(
    name: string,
    description: string,
  ): Promise<[boolean, CreateHubError, Hub]> {
    const [createHubStatus, createHubResponse] =
      await this.hubsPackageService.createHub(name, description);

    if (!createHubStatus) {
      return [false, CreateHubError.CreateHubError, null];
    }

    const { isHubCreated, hub } = createHubResponse;

    if (!isHubCreated) {
      return [false, CreateHubError.HubNotCreated, null];
    }

    return [true, null, hub];
  }
}

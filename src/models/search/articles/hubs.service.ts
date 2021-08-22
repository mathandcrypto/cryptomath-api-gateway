import { Injectable } from '@nestjs/common';
import { SearchArticlesPackageService } from '@providers/grpc/search/search-articles-package.service';
import { HubsPackageService } from '@providers/grpc/articles/hubs-package.service';
import { HubsFilters, HubsSorts } from '@cryptomath/cryptomath-api-proto/types/search';
import { Hub } from '@cryptomath/cryptomath-api-proto/types/articles';
import { SearchArticlesHubsFiltersQuery } from './interfaces/query/hubs-filters.interface';
import { SearchArticlesHubsSortsQuery } from './interfaces/query/hubs-sorts.interface';
import { SearchArticlesError } from './enums/errors/search.error';
import { SearchArticlesHubsList } from './interfaces/hubs-list.interface';
import { SearchHit } from '../interfaces/search-hit.interface';
import { sortOrderToProto } from '@common/helpers/sorts';

@Injectable()
export class SearchArticlesHubsService {
  constructor(
    private readonly searchArticlesPackageService: SearchArticlesPackageService,
    private readonly hubsPackageService: HubsPackageService,
  ) {}

  prepareFilters(filtersQuery: SearchArticlesHubsFiltersQuery): HubsFilters {
    const filters = {} as HubsFilters;

    if (filtersQuery.articles) {
      const {
        equals: articlesEqual,
        min: articlesMin,
        max: articlesMax,
      } = filtersQuery.articles;

      filters.articles = {
        equals: articlesEqual,
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

  prepareSorts(sortsQuery?: SearchArticlesHubsSortsQuery): HubsSorts {
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

  async search(
    query: string,
    filters: HubsFilters,
    sorts: HubsSorts,
    offset: number,
    limit: number,
  ): Promise<[boolean, SearchArticlesError, SearchArticlesHubsList]> {
    const [searchHubsStatus, searchHubsResponse] =
      await this.searchArticlesPackageService.searchHubs(
        query,
        filters,
        sorts,
        offset,
        limit,
      );

    if (!searchHubsStatus) {
      return [false, SearchArticlesError.SearchHubsError, null];
    }

    const { isHubsFound, took, limit: take, total, hubs } = searchHubsResponse;

    if (!isHubsFound) {
      return [false, SearchArticlesError.HubsNotFound, null];
    }

    if (total === 0) {
      return [true, null, { took, total, limit: take, hubs: [] }];
    }

    const [findHubsStatus, findHubsResponse] =
      await this.hubsPackageService.findHubsFromList(
        hubs.map((hub) => hub.sourceId),
      );

    if (!findHubsStatus) {
      return [false, SearchArticlesError.FindSourceHubsError, null];
    }

    const { isHubsFound: isSourceHubsFound, hubs: sourceHubs } =
      findHubsResponse;

    if (!isSourceHubsFound) {
      return [false, SearchArticlesError.SourceHubsNotFound, null];
    }

    return [
      true,
      null,
      {
        took,
        limit: take,
        total,
        hubs: hubs.reduce<Array<SearchHit<Hub>>>((hubsFound, hubHit) => {
          const hub = sourceHubs[hubHit.sourceId];

          if (hub) {
            hubsFound.push({
              id: hubHit.id,
              index: hubHit.index,
              score: hubHit.score,
              data: hub,
            });
          }

          return hubsFound;
        }, []),
      },
    ];
  }
}

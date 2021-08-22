import { Injectable } from '@nestjs/common';
import { SearchArticlesPackageService } from '@providers/grpc/search/search-articles-package.service';
import { TagsPackageService } from '@providers/grpc/articles/tags-package.service';
import { TagsFilters, TagsSorts } from '@cryptomath/cryptomath-api-proto/types/search';
import { Tag } from '@cryptomath/cryptomath-api-proto/types/articles';
import { SearchArticlesTagsFiltersQuery } from './interfaces/query/tags-filters.interface';
import { SearchArticlesTagsSortsQuery } from './interfaces/query/tags-sorts.interface';
import { SearchArticlesError } from './enums/errors/search.error';
import { SearchArticlesTagsList } from './interfaces/tags-list.interface';
import { SearchHit } from '../interfaces/search-hit.interface';
import { sortOrderToProto } from '@common/helpers/sorts';

@Injectable()
export class SearchArticlesTagsService {
  constructor(
    private readonly searchArticlesPackageService: SearchArticlesPackageService,
    private readonly tagsPackageService: TagsPackageService,
  ) {}

  prepareFilters(filtersQuery: SearchArticlesTagsFiltersQuery): TagsFilters {
    const filters = {} as TagsFilters;

    if (filtersQuery.hub_id) {
      filters.hub = { id: filtersQuery.hub_id };
    }

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

    return filters;
  }

  prepareSorts(sortsQuery?: SearchArticlesTagsSortsQuery): TagsSorts {
    const sorts = {} as TagsSorts;

    if (sortsQuery) {
      if (sortsQuery.name) {
        sorts.name = { direction: sortOrderToProto(sortsQuery.name) };
      }

      if (sortsQuery.articles) {
        sorts.articles = { direction: sortOrderToProto(sortsQuery.articles) };
      }
    }

    return sorts;
  }

  async search(
    query: string,
    filters: TagsFilters,
    sorts: TagsSorts,
    offset: number,
    limit: number,
  ): Promise<[boolean, SearchArticlesError, SearchArticlesTagsList]> {
    const [searchTagsStatus, searchTagsResponse] =
      await this.searchArticlesPackageService.searchTags(
        query,
        filters,
        sorts,
        offset,
        limit,
      );

    if (!searchTagsStatus) {
      return [false, SearchArticlesError.SearchTagsError, null];
    }

    const { isTagsFound, took, limit: take, total, tags } = searchTagsResponse;

    if (!isTagsFound) {
      return [false, SearchArticlesError.TagsNotFound, null];
    }

    if (total === 0) {
      return [true, null, { took, total, limit: take, tags: [] }];
    }

    const [findTagsStatus, findTagsResponse] =
      await this.tagsPackageService.findTagsFromList(
        tags.map((tag) => tag.sourceId),
      );

    if (!findTagsStatus) {
      return [false, SearchArticlesError.FindSourceTagsError, null];
    }

    const { isTagsFound: isSourceTagsFound, tags: sourceTags } =
      findTagsResponse;

    if (!isSourceTagsFound) {
      return [false, SearchArticlesError.SourceTagsNotFound, null];
    }

    return [
      true,
      null,
      {
        took,
        limit: take,
        total,
        tags: tags.reduce<Array<SearchHit<Tag>>>((tagsFound, tagHit) => {
          const tag = sourceTags[tagHit.sourceId];

          if (tag) {
            tagsFound.push({
              id: tagHit.id,
              index: tagHit.index,
              score: tagHit.score,
              data: tag,
            });
          }

          return tagsFound;
        }, []),
      },
    ];
  }
}

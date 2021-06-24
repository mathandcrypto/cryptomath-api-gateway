import { Injectable } from '@nestjs/common';
import { ArticlesPackageService } from '@providers/grpc/articles/articles-package.service';
import { NumericRangeQuery } from '@common/interfaces/requests/query/numeric-range.interface';
import {
  TagsFilters,
  TagsSorts,
  Tag,
} from 'cryptomath-api-proto/types/articles';
import { TagsSortsQuery } from './interfaces/tags-sorts-query.interface';
import { FindMultipleError } from './enums/errors/find-multiple.enum';
import { TagsList } from './interfaces/tags-list.interface';
import { sortOrderToProto } from '@common/helpers/sorts';
import { FindOneError } from '@models/articles/enums/errors/find-one.enum';

@Injectable()
export class TagsService {
  constructor(
    private readonly articlesPackageService: ArticlesPackageService,
  ) {}

  prepareFilters(
    id: number | undefined,
    name: string | undefined,
    hubId: number | undefined,
    articles: NumericRangeQuery | undefined,
  ): TagsFilters {
    const filters = {} as TagsFilters;

    if (id) {
      filters.id = { id };
    }

    if (name) {
      filters.name = { text: name };
    }

    if (hubId) {
      filters.hub = { id: hubId };
    }

    if (articles) {
      filters.articles = {
        equals: articles.equals,
        min: articles.min,
        max: articles.max,
      };
    }

    return filters;
  }

  prepareSorts(sortsQuery: TagsSortsQuery | undefined): TagsSorts {
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

  async findMultiple(
    filters: TagsFilters,
    sorts: TagsSorts,
    offset = 0,
    limit = 30,
  ): Promise<[boolean, FindMultipleError, TagsList]> {
    const [
      findTagsStatus,
      findTagsResponse,
    ] = await this.articlesPackageService.findTags(
      filters,
      sorts,
      offset,
      limit,
    );

    if (!findTagsStatus) {
      return [false, FindMultipleError.FindTagsError, null];
    }

    const { isTagsFound, limit: take, total, tags } = findTagsResponse;

    if (!isTagsFound) {
      return [false, FindMultipleError.TagsNotFound, null];
    }

    return [
      true,
      null,
      {
        limit: take,
        total,
        tags: tags || [],
      },
    ];
  }

  async findOne(tagId: number): Promise<[boolean, FindOneError, Tag]> {
    const [
      findTagStatus,
      findTagResponse,
    ] = await this.articlesPackageService.findTag(tagId);

    if (!findTagStatus) {
      return [false, FindOneError.FindTagError, null];
    }

    const { isTagExists, tag } = findTagResponse;

    if (!isTagExists) {
      return [false, FindOneError.TagNotExists, null];
    }

    return [true, null, tag];
  }
}

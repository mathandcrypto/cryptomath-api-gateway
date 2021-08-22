import { Injectable } from '@nestjs/common';
import { TagsPackageService } from '@providers/grpc/articles/tags-package.service';
import {
  Tag,
  TagsFilters,
  TagsSorts,
} from '@cryptomath/cryptomath-api-proto/types/articles';
import { TagsFiltersQuery } from './interfaces/query/tags-filters.interface';
import { TagsSortsQuery } from './interfaces/query/tags-sorts.interface';
import { FindMultipleError } from './enums/errors/find-multiple.enum';
import { TagsList } from './interfaces/tags-list.interface';
import { sortOrderToProto } from '@common/helpers/sorts';
import { FindOneError } from '@models/articles/enums/errors/find-one.enum';
import { CreateTagError } from './enums/errors/create-tag.error';

@Injectable()
export class TagsService {
  constructor(private readonly tagsPackageService: TagsPackageService) {}

  prepareFilters(filtersQuery: TagsFiltersQuery): TagsFilters {
    const filters = {} as TagsFilters;

    if (filtersQuery.id) {
      filters.id = { id: filtersQuery.id };
    }

    if (filtersQuery.name) {
      filters.name = { text: filtersQuery.name };
    }

    if (filtersQuery.hub_id) {
      filters.hub = { id: filtersQuery.hub_id };
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

    return filters;
  }

  prepareSorts(sortsQuery?: TagsSortsQuery): TagsSorts {
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
    const [findTagsStatus, findTagsResponse] =
      await this.tagsPackageService.findTags(filters, sorts, offset, limit);

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
    const [findTagStatus, findTagResponse] =
      await this.tagsPackageService.findTag(tagId);

    if (!findTagStatus) {
      return [false, FindOneError.FindTagError, null];
    }

    const { isTagExists, tag } = findTagResponse;

    if (!isTagExists) {
      return [false, FindOneError.TagNotExists, null];
    }

    return [true, null, tag];
  }

  async createTag(
    hubId: number,
    name: string,
    description: string,
  ): Promise<[boolean, CreateTagError, Tag]> {
    const [createTagStatus, createTagResponse] =
      await this.tagsPackageService.createTag(hubId, name, description);

    if (!createTagStatus) {
      return [false, CreateTagError.CreateTagError, null];
    }

    const { isTagCreated, tag } = createTagResponse;

    if (!isTagCreated) {
      return [false, CreateTagError.TagNotCreated, null];
    }

    return [true, null, tag];
  }
}

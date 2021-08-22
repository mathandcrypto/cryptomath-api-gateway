import { Injectable } from '@nestjs/common';
import { ArticlesPackageService } from '@providers/grpc/articles/articles-package.service';
import {
  ArticlesFilters,
  ArticlesSorts,
} from '@cryptomath/cryptomath-api-proto/types/articles';
import { ArticlesFiltersQuery } from './interfaces/query/articles-filters.interface';
import { ArticlesSortsQuery } from './interfaces/query/articles-sorts.interface';
import { sortOrderToProto } from '@common/helpers/sorts';
import { FindMultipleError } from './enums/errors/find-multiple.enum';
import { UserPackageService } from '@providers/grpc/user/user-package.service';
import { ArticleExtra } from './interfaces/article-extra.interface';
import { ArticlesList } from './interfaces/articles-list.interface';
import { getUnixTime } from 'date-fns';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly articlesPackageService: ArticlesPackageService,
    private readonly userPackageService: UserPackageService,
  ) {}

  prepareFilters(filtersQuery: ArticlesFiltersQuery): ArticlesFilters {
    const filters = {} as ArticlesFilters;

    if (filtersQuery.id) {
      filters.id = { id: filtersQuery.id };
    }

    if (filtersQuery.title) {
      filters.title = { text: filtersQuery.title };
    }

    if (filtersQuery.user_id) {
      filters.user = { id: filtersQuery.user_id };
    }

    if (filtersQuery.hubs) {
      filters.hubs = { idList: filtersQuery.hubs };
    }

    if (filtersQuery.tags) {
      filters.tags = { idList: filtersQuery.tags };
    }

    if (filtersQuery.comments) {
      const {
        equals: commentsEquals,
        min: commentsMin,
        max: commentsMax,
      } = filtersQuery.comments;

      filters.comments = {
        equals: commentsEquals,
        min: commentsMin,
        max: commentsMax,
      };
    }

    if (filtersQuery.rating) {
      const {
        equals: ratingEquals,
        min: ratingMin,
        max: ratingMax,
      } = filtersQuery.rating;

      filters.rating = {
        equals: ratingEquals,
        min: ratingMin,
        max: ratingMax,
      };
    }

    if (filtersQuery.created_at) {
      const { start: createdAfter, end: createdBefore } =
        filtersQuery.created_at;

      filters.createdAt = {
        start: createdAfter ? getUnixTime(createdAfter) : undefined,
        end: createdBefore ? getUnixTime(createdBefore) : undefined,
      };
    }

    return filters;
  }

  prepareSorts(sortsQuery?: ArticlesSortsQuery): ArticlesSorts {
    const sorts = {} as ArticlesSorts;

    if (sortsQuery) {
      if (sortsQuery.title) {
        sorts.title = { direction: sortOrderToProto(sortsQuery.title) };
      }

      if (sortsQuery.comments) {
        sorts.comments = { direction: sortOrderToProto(sortsQuery.comments) };
      }

      if (sortsQuery.rating) {
        sorts.rating = { direction: sortOrderToProto(sortsQuery.rating) };
      }

      if (sortsQuery.created_at) {
        sorts.createdAt = {
          direction: sortOrderToProto(sortsQuery.created_at),
        };
      }
    }

    return sorts;
  }

  async findMultiple(
    filters: ArticlesFilters,
    sorts: ArticlesSorts,
    offset = 0,
    limit = 30,
  ): Promise<[boolean, FindMultipleError, ArticlesList]> {
    const [findArticlesStatus, findArticlesResponse] =
      await this.articlesPackageService.findArticles(
        filters,
        sorts,
        offset,
        limit,
      );

    if (!findArticlesStatus) {
      return [false, FindMultipleError.FindArticlesError, null];
    }

    const {
      isArticlesFound,
      limit: take,
      total,
      articles,
    } = findArticlesResponse;

    if (!isArticlesFound) {
      return [false, FindMultipleError.ArticlesNotFound, null];
    }

    if (total === 0) {
      return [
        true,
        null,
        {
          limit: take,
          total,
          articles: [],
        },
      ];
    }

    const [findUsersStatus, findUsersResponse] =
      await this.userPackageService.findFromList(
        articles.map((article) => article.userId),
      );

    if (!findUsersStatus) {
      return [false, FindMultipleError.FindUsersError, null];
    }

    const { isUsersFound, users } = findUsersResponse;

    if (!isUsersFound) {
      return [false, FindMultipleError.UsersNotFound, null];
    }

    return [
      true,
      null,
      {
        limit: take,
        total,
        articles: articles.reduce<Array<ArticleExtra>>(
          (articlesExtra, article) => {
            const user = users[article.userId];

            if (user) {
              articlesExtra.push({
                ...article,
                user,
              });
            }

            return articlesExtra;
          },
          [],
        ),
      },
    ];
  }
}

import { Injectable } from '@nestjs/common';
import { ArticlesPackageService } from '@providers/grpc/articles/articles-package.service';
import {
  ArticlesFilters,
  ArticlesSorts,
} from 'cryptomath-api-proto/types/articles';
import { NumericRangeQuery } from '@common/interfaces/requests/query/numeric-range.interface';
import { DateTimeRangeQuery } from '@common/interfaces/requests/query/date-time-range.interface';
import { ArticlesSortsQuery } from './interfaces/articles-sorts-query.interface';
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

  prepareFilters(
    id: number | undefined,
    title: string | undefined,
    userId: number | undefined,
    hubs: number[] | undefined,
    tags: number[] | undefined,
    comments: NumericRangeQuery | undefined,
    rating: NumericRangeQuery | undefined,
    createdAt: DateTimeRangeQuery | undefined,
  ): ArticlesFilters {
    const filters = {} as ArticlesFilters;

    if (id) {
      filters.id = { id };
    }

    if (title) {
      filters.title = { text: title };
    }

    if (userId) {
      filters.user = { id: userId };
    }

    if (hubs) {
      filters.hubs = { idList: hubs };
    }

    if (tags) {
      filters.tags = { idList: tags };
    }

    if (comments) {
      filters.comments = {
        equals: comments.equals,
        min: comments.min,
        max: comments.max,
      };
    }

    if (rating) {
      filters.rating = {
        equals: rating.equals,
        min: rating.min,
        max: rating.max,
      };
    }

    if (createdAt) {
      filters.createdAt = {
        start: createdAt.start ? getUnixTime(createdAt.start) : undefined,
        end: createdAt.end ? getUnixTime(createdAt.end) : undefined,
      };
    }

    return filters;
  }

  prepareSorts(sortsQuery: ArticlesSortsQuery | undefined): ArticlesSorts {
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
    const [
      findArticlesStatus,
      findArticlesResponse,
    ] = await this.articlesPackageService.findArticles(
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

    const [
      findUsersStatus,
      findUsersResponse,
    ] = await this.userPackageService.findFromList(
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

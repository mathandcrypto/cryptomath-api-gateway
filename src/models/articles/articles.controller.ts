import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetArticlesQueryDTO } from './dto/request/query/get-articles.dto';
import { ArticlesService } from './articles.service';
import { FindMultipleError } from '@models/articles/enums/errors/find-multiple.enum';
import { GetArticlesException } from './constants/exceptions/get-articles.exception';
import { ArticlesListResponseDTO } from './dto/response/articles-list.dto';
import { ArticleSerializerService } from './serializers/article.serializer';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly articleSerializerService: ArticleSerializerService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get a list of articles by the specified filters and sortings',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Maximum number of articles in the list',
    required: false,
    example: 50,
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    description: 'Articles offset',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'sorts',
    type: String,
    required: false,
    description: 'Sorting options for the list of articles',
    examples: {
      title_asc: {
        value: 'title:asc',
        description: 'Sort articles by title in ascending order',
      },
      title_desc: {
        value: 'title:desc',
        description: 'Sort articles by title in descending order',
      },
      comments_asc: {
        value: 'comments:asc',
        description: 'Sort articles by number of comments in ascending order',
      },
      comments_desc: {
        value: 'comments:desc',
        description: 'Sort articles by number of comments in descending order',
      },
      rating_asc: {
        value: 'rating:asc',
        description: 'Sort articles by rating in ascending order',
      },
      rating_desc: {
        value: 'rating:desc',
        description: 'Sort articles by rating in descending order',
      },
      created_at_asc: {
        value: 'created_at:asc',
        description: 'Sort articles by creation date in ascending order',
      },
      created_at_desc: {
        value: 'created_at:desc',
        description: 'Sort articles by creation date in descending order',
      },
      multiple_sorts: {
        value: 'title:asc,created_at:desc',
        description: 'Multiple sorting by title and date of article creation',
      },
    },
  })
  @ApiQuery({
    name: 'created_at',
    type: String,
    required: false,
    description: 'Filter for numeric range of article creation date',
    examples: {
      range: {
        value: `${new Date(2020, 1, 1).toISOString()}..${new Date(
          2021,
          1,
          1,
        ).toISOString()}`,
        description: 'Article creation date range',
      },
      start: {
        value: `${new Date(2020, 1, 1).toISOString()}..`,
        description: 'Starting date of article creation',
      },
      end: {
        value: `..${new Date(2021, 1, 1).toISOString()}`,
        description: 'Final date of creation of the article',
      },
    },
  })
  @ApiQuery({
    name: 'rating',
    type: String,
    required: false,
    description: 'Numeric range filter of article rating',
    examples: {
      equals: {
        value: '10',
        description: 'The exact value of the article rating',
      },
      range: {
        value: '0:100',
        description: 'The range of values for the rating of the article',
      },
      min: {
        value: '20:',
        description: 'The minimum value of the rating of the article',
      },
      max: {
        value: ':500',
        description: 'The maximum value of the rating of the article',
      },
    },
  })
  @ApiQuery({
    name: 'comments',
    type: String,
    required: false,
    description: 'Numeric range filter of article comments',
    examples: {
      equals: {
        value: '1',
        description: 'The exact value of the number of article comments',
      },
      range: {
        value: '1:10',
        description: 'Range of values for the number of article comments',
      },
      min: {
        value: '5:',
        description: 'The minimum value for the number of article comments',
      },
      max: {
        value: ':50',
        description: 'The maximum value for the number of article comments',
      },
    },
  })
  @ApiQuery({
    name: 'tags',
    type: String,
    required: false,
    description: 'List of tag ids separated by commas',
    example: '1,2,3',
  })
  @ApiQuery({
    name: 'hubs',
    type: String,
    required: false,
    description: 'List of hub ids separated by commas',
    example: '1,2,3',
  })
  @ApiQuery({
    name: 'user_id',
    type: Number,
    required: false,
    description: 'User id',
  })
  @ApiQuery({
    name: 'title',
    type: String,
    required: false,
    description: 'Article title',
  })
  @ApiQuery({
    name: 'id',
    type: Number,
    required: false,
    description: 'Article id',
  })
  @ApiResponse({
    status: 200,
    type: ArticlesListResponseDTO,
    description: 'List of articles',
  })
  async getArticles(
    @Query()
    {
      id,
      title,
      user_id: userId,
      hubs,
      tags,
      comments,
      rating,
      created_at: createdAt,
      sorts,
      offset,
      limit,
    }: GetArticlesQueryDTO,
  ): Promise<ArticlesListResponseDTO> {
    const articlesFilters = this.articlesService.prepareFilters(
      id,
      title,
      userId,
      hubs,
      tags,
      comments,
      rating,
      createdAt,
    );

    const articlesSorts = this.articlesService.prepareSorts(sorts);
    const [
      findMultipleStatus,
      findMultipleError,
      findMultipleResponse,
    ] = await this.articlesService.findMultiple(
      articlesFilters,
      articlesSorts,
      offset,
      limit,
    );

    if (!findMultipleStatus) {
      switch (findMultipleError) {
        case FindMultipleError.FindArticlesError:
        case FindMultipleError.ArticlesNotFound:
          throw new InternalServerErrorException(
            GetArticlesException.FindArticlesError,
          );
        case FindMultipleError.FindUsersError:
        case FindMultipleError.UsersNotFound:
          throw new InternalServerErrorException(
            GetArticlesException.FindUsersError,
          );
        default:
          throw new InternalServerErrorException(
            GetArticlesException.UnknownGetArticlesError,
          );
      }
    }

    const { limit: take, total, articles } = findMultipleResponse;

    return {
      limit: take,
      offset,
      total,
      articles: await this.articleSerializerService.serializeCollection(
        articles,
      ),
    };
  }
}

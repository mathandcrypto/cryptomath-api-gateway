import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { SearchArticlesTagsQueryDTO } from './dto/request/query/search-tags.dto';
import { SearchArticlesTagsService } from './tags.service';
import { SearchArticlesError } from './enums/errors/search.error';
import { SearchArticlesTagsException } from './constants/exceptions/search-tags.exception';
import { SearchArticlesTagsListResponseDTO } from './dto/response/tags-list.dto';
import { SearchArticlesTagSerializerService } from './serializers/tag.serializer';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('search', 'tags')
@Controller('search/tags')
export class SearchArticlesTagsController {
  constructor(
    private readonly tagsService: SearchArticlesTagsService,
    private readonly tagSerializerService: SearchArticlesTagSerializerService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Search for articles tags by specified filters and sorts',
  })
  @ApiQuery({
    name: 'articles',
    type: String,
    required: false,
    description: 'Numeric range filter of tag articles count',
    examples: {
      equals: {
        value: '1',
        description: 'The exact value of the number of tag articles count',
      },
      range: {
        value: '1:10',
        description: 'Range of values for the number of tag articles count',
      },
      min: {
        value: '5:',
        description: 'The minimum value for the number of tag articles count',
      },
      max: {
        value: ':50',
        description: 'The maximum value for the number of tag articles count',
      },
    },
  })
  @ApiQuery({
    name: 'hub_id',
    type: Number,
    required: false,
    description: 'Hub id',
  })
  @ApiQuery({
    name: 'query',
    type: String,
    description: 'Search tags query',
  })
  @ApiResponse({
    status: 200,
    type: SearchArticlesTagsListResponseDTO,
    description: 'List of found tags',
  })
  async searchTags(
    @Query()
    {
      query,
      hub_id,
      articles,
      sorts,
      limit,
      offset,
    }: SearchArticlesTagsQueryDTO,
  ): Promise<SearchArticlesTagsListResponseDTO> {
    const tagsFilters = this.tagsService.prepareFilters({ hub_id, articles });
    const tagsSorts = this.tagsService.prepareSorts(sorts);
    const [searchTagsStatus, searchTagsError, searchTagsResponse] =
      await this.tagsService.search(
        query,
        tagsFilters,
        tagsSorts,
        offset,
        limit,
      );

    if (!searchTagsStatus) {
      switch (searchTagsError) {
        case SearchArticlesError.SearchTagsError:
        case SearchArticlesError.TagsNotFound:
          throw new InternalServerErrorException(
            SearchArticlesTagsException.SearchTagsError,
          );
        case SearchArticlesError.FindSourceTagsError:
        case SearchArticlesError.SourceTagsNotFound:
          throw new InternalServerErrorException(
            SearchArticlesTagsException.FindSourceTagsError,
          );
        default:
          throw new InternalServerErrorException(
            SearchArticlesTagsException.UnknownTagsSearchError,
          );
      }
    }

    const { took, limit: take, total, tags } = searchTagsResponse;

    return {
      took,
      limit: take,
      offset,
      total,
      tags: await this.tagSerializerService.serializeCollection(tags),
    };
  }
}

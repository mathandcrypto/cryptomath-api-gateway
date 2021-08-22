import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { SearchArticlesHubsQueryDTO } from './dto/request/query/search-hubs.dto';
import { SearchArticlesHubsService } from './hubs.service';
import { SearchArticlesError } from './enums/errors/search.error';
import { SearchArticlesHubsException } from './constants/exceptions/search-hubs.exception';
import { SearchArticlesHubsListResponseDTO } from './dto/response/hubs-list.dto';
import { SearchArticlesHubSerializerService } from './serializers/hub.serializer';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('search', 'hubs')
@Controller('search/hubs')
export class SearchArticlesHubsController {
  constructor(
    private readonly hubsService: SearchArticlesHubsService,
    private readonly hubSerializerService: SearchArticlesHubSerializerService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Search for articles hubs by specified filters and sorts',
  })
  @ApiQuery({
    name: 'tags',
    type: String,
    required: false,
    description: 'Numeric range filter of hub tags count',
    examples: {
      equals: {
        value: '1',
        description: 'The exact value of the number of hub tags count',
      },
      range: {
        value: '1:10',
        description: 'Range of values for the number of hub tags count',
      },
      min: {
        value: '5:',
        description: 'The minimum value for the number of hub tags count',
      },
      max: {
        value: ':50',
        description: 'The maximum value for the number of hub tags count',
      },
    },
  })
  @ApiQuery({
    name: 'articles',
    type: String,
    required: false,
    description: 'Numeric range filter of hub articles count',
    examples: {
      equals: {
        value: '1',
        description: 'The exact value of the number of hub articles count',
      },
      range: {
        value: '1:10',
        description: 'Range of values for the number of hub articles count',
      },
      min: {
        value: '5:',
        description: 'The minimum value for the number of hub articles count',
      },
      max: {
        value: ':50',
        description: 'The maximum value for the number of hub articles count',
      },
    },
  })
  @ApiQuery({
    name: 'query',
    type: String,
    description: 'Search hubs query',
  })
  @ApiResponse({
    status: 200,
    type: SearchArticlesHubsListResponseDTO,
    description: 'List of found hubs',
  })
  async searchHubs(
    @Query()
    { query, articles, tags, sorts, limit, offset }: SearchArticlesHubsQueryDTO,
  ): Promise<SearchArticlesHubsListResponseDTO> {
    const hubsFilters = this.hubsService.prepareFilters({ articles, tags });
    const hubsSorts = this.hubsService.prepareSorts(sorts);
    const [searchHubsStatus, searchHubsError, searchHubsResponse] =
      await this.hubsService.search(
        query,
        hubsFilters,
        hubsSorts,
        offset,
        limit,
      );

    if (!searchHubsStatus) {
      switch (searchHubsError) {
        case SearchArticlesError.SearchHubsError:
        case SearchArticlesError.HubsNotFound:
          throw new InternalServerErrorException(
            SearchArticlesHubsException.SearchHubsError,
          );
        case SearchArticlesError.FindSourceHubsError:
        case SearchArticlesError.SourceHubsNotFound:
          throw new InternalServerErrorException(
            SearchArticlesHubsException.FindSourceHubsError,
          );
        default:
          throw new InternalServerErrorException(
            SearchArticlesHubsException.UnknownHubsSearchError,
          );
      }
    }

    const { took, limit: take, total, hubs } = searchHubsResponse;

    return {
      took,
      limit: take,
      offset,
      total,
      hubs: await this.hubSerializerService.serializeCollection(hubs),
    };
  }
}

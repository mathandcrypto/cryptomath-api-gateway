import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetHubsQueryDTO } from './dto/request/query/get-hubs.dto';
import { HubsListResponseDTO } from './dto/response/hubs-list.dto';
import { HubsService } from './hubs.service';
import { FindMultipleError } from './enums/errors/find-multiple.enum';
import { GetHubsException } from './constants/exceptions/get-hubs.exception';
import { HubSerializerService } from './serializers/hub.serializer';

@ApiTags('hubs')
@Controller('hubs')
export class HubsController {
  constructor(
    private readonly hubsService: HubsService,
    private readonly hubSerializerService: HubSerializerService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get a list of hubs by the specified filters and sortings',
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
    name: 'tags_list',
    type: String,
    required: false,
    description: 'List of tag ids separated by commas',
    example: '1,2,3',
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'Hub name',
  })
  @ApiQuery({
    name: 'id',
    type: Number,
    required: false,
    description: 'Hub id',
  })
  @ApiResponse({
    status: 200,
    type: HubsListResponseDTO,
    description: 'List of hubs',
  })
  async getHubs(
    @Query()
    {
      id,
      name,
      tags_list: tagsList,
      articles,
      tags,
      sorts,
      offset,
      limit,
    }: GetHubsQueryDTO,
  ): Promise<HubsListResponseDTO> {
    const hubsFilters = this.hubsService.prepareFilters(
      id,
      name,
      tagsList,
      articles,
      tags,
    );
    const hubsSorts = this.hubsService.prepareSorts(sorts);
    const [
      findMultipleStatus,
      findMultipleError,
      findMultipleResponse,
    ] = await this.hubsService.findMultiple(
      hubsFilters,
      hubsSorts,
      offset,
      limit,
    );

    if (!findMultipleStatus) {
      switch (findMultipleError) {
        case FindMultipleError.FindHubsError:
        case FindMultipleError.HubsNotFound:
          throw new InternalServerErrorException(
            GetHubsException.FindHubsError,
          );
        default:
          throw new InternalServerErrorException(
            GetHubsException.UnknownGetHubsError,
          );
      }
    }

    const { limit: take, total, hubs } = findMultipleResponse;

    return {
      limit: take,
      offset,
      total,
      hubs: await this.hubSerializerService.serializeCollection(hubs),
    };
  }
}
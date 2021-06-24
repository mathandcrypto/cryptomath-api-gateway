import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagSerializerService } from './serializers/tag.serializer';
import { GetTagsQueryDTO } from './dto/request/query/get-tags.dto';
import { TagsListResponseDTO } from './dto/response/tags-list.dto';
import { FindMultipleError } from './enums/errors/find-multiple.enum';
import { GetTagsException } from './constants/exceptions/get-tags.exception';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(
    private readonly tagsService: TagsService,
    private readonly tagSerializerService: TagSerializerService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get a list of tags by the specified filters and sortings',
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
    name: 'name',
    type: String,
    required: false,
    description: 'Tag name',
  })
  @ApiQuery({
    name: 'id',
    type: Number,
    required: false,
    description: 'Tag id',
  })
  @ApiResponse({
    status: 200,
    type: TagsListResponseDTO,
    description: 'List of tags',
  })
  async getTags(
    @Query()
    {
      id,
      name,
      hub_id: hubId,
      articles,
      sorts,
      offset,
      limit,
    }: GetTagsQueryDTO,
  ): Promise<TagsListResponseDTO> {
    const tagsFilters = this.tagsService.prepareFilters(
      id,
      name,
      hubId,
      articles,
    );
    const tagsSorts = this.tagsService.prepareSorts(sorts);
    const [
      findMultipleStatus,
      findMultipleError,
      findMultipleResponse,
    ] = await this.tagsService.findMultiple(
      tagsFilters,
      tagsSorts,
      offset,
      limit,
    );

    if (!findMultipleStatus) {
      switch (findMultipleError) {
        case FindMultipleError.FindTagsError:
        case FindMultipleError.TagsNotFound:
          throw new InternalServerErrorException(
            GetTagsException.FindTagsError,
          );
        default:
          throw new InternalServerErrorException(
            GetTagsException.UnknownGetTagsError,
          );
      }
    }

    const { limit: take, total, tags } = findMultipleResponse;

    return {
      limit: take,
      offset,
      total,
      tags: await this.tagSerializerService.serializeCollection(tags),
    };
  }
}

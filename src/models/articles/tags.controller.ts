import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagSerializerService } from './serializers/tag.serializer';
import { GetTagsQueryDTO } from './dto/request/query/get-tags.dto';
import { TagsListResponseDTO } from './dto/response/tags-list.dto';
import { FindMultipleError } from './enums/errors/find-multiple.enum';
import { GetTagsException } from './constants/exceptions/get-tags.exception';
import { TagResponseDTO } from './dto/response/tag.dto';
import { FindOneError } from './enums/errors/find-one.enum';
import { GetTagException } from './constants/exceptions/get-tag.exception';
import { CreateTagRequestDTO } from './dto/request/create-tag.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { CreateTagError } from './enums/errors/create-tag.error';
import { CreateTagException } from './constants/exceptions/create-tag.exception';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(
    private readonly tagsService: TagsService,
    private readonly tagSerializerService: TagSerializerService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get a list of tags by the specified filters and sorts',
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
    { id, name, hub_id, articles, sorts, offset, limit }: GetTagsQueryDTO,
  ): Promise<TagsListResponseDTO> {
    const tagsFilters = this.tagsService.prepareFilters({
      id,
      name,
      hub_id,
      articles,
    });
    const tagsSorts = this.tagsService.prepareSorts(sorts);
    const [findMultipleStatus, findMultipleError, findMultipleResponse] =
      await this.tagsService.findMultiple(
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

  @Get(':id')
  @ApiOperation({ summary: 'Get tag data by id' })
  @ApiParam({ name: 'id', description: 'Tag id' })
  @ApiResponse({
    status: 200,
    type: TagResponseDTO,
    description: 'Tag data',
  })
  async getTag(
    @Param('id', ParseIntPipe) tagId: number,
  ): Promise<TagResponseDTO> {
    const [findOneStatus, findOneError, tag] = await this.tagsService.findOne(
      tagId,
    );

    if (!findOneStatus) {
      switch (findOneError) {
        case FindOneError.FindTagError:
        case FindOneError.TagNotExists:
          throw new InternalServerErrorException(GetTagException.FindTagError);
        default:
          throw new InternalServerErrorException(
            GetTagException.UnknownGetTagError,
          );
      }
    }

    return await this.tagSerializerService.serialize(tag);
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Create a new tag',
    description: 'Available only to administrators and moderators',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateTagRequestDTO })
  @ApiResponse({
    status: 200,
    type: TagResponseDTO,
    description: 'Tag data',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Moderator)
  async createTag(
    @Body() { hub_id: hubId, name, description }: CreateTagRequestDTO,
  ): Promise<TagResponseDTO> {
    const [createTagStatus, createTagError, tag] =
      await this.tagsService.createTag(hubId, name, description);

    if (!createTagStatus) {
      switch (createTagError) {
        case CreateTagError.CreateTagError:
          throw new InternalServerErrorException(
            CreateTagException.CreateTagError,
          );
        case CreateTagError.TagNotCreated:
          throw new InternalServerErrorException(
            CreateTagException.TagNotCreated,
          );
        default:
          throw new InternalServerErrorException(
            CreateTagException.UnknownCreateTagError,
          );
      }
    }

    return await this.tagSerializerService.serialize(tag);
  }
}

import {
  BadRequestException,
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
  UseInterceptors,
} from '@nestjs/common';
import { GetHubsQueryDTO } from './dto/request/query/get-hubs.dto';
import { HubsListResponseDTO } from './dto/response/hubs-list.dto';
import { UploadHubLogoRequestDTO } from './dto/request/upload-hub-logo.dto';
import { UploadHubLogoResponseDTO } from './dto/response/upload-hub-logo.dto';
import { HubsService } from './hubs.service';
import { FindMultipleError } from './enums/errors/find-multiple.enum';
import { GetHubsException } from './constants/exceptions/get-hubs.exception';
import { HubSerializerService } from './serializers/hub.serializer';
import { HubResponseDTO } from './dto/response/hub.dto';
import { FindOneError } from './enums/errors/find-one.enum';
import { GetHubException } from './constants/exceptions/get-hub.exception';
import { CreateHubRequestDTO } from './dto/request/create-hub.dto';
import { CreateHubError } from './enums/errors/create-hub.error';
import { CreateHubException } from './constants/exceptions/create-hub.exception';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Role } from '@common/enums/role.enum';
import { FastifyFileInterceptor } from '@common/interceptors/fastify-file.interceptor';
import { GetAuthUser } from '@common/decorators/requests/get-auth-user.decorator';
import { AuthUser } from '@auth/interfaces/auth-user.interface';
import { FastifyUploadedFile } from '@common/decorators/requests/fastify-uploaded-file.decorator';
import { Multipart } from 'fastify-multipart';
import { UploadHubLogoError } from '@models/articles/enums/errors/upload-hub-logo.enum';
import { UploadHubLogoException } from './constants/exceptions/upload-hub-logo.exception';
import { UploadHubLogoSerializerService } from './serializers/upload-hub-logo.serializer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('hubs')
@Controller('hubs')
export class HubsController {
  constructor(
    private readonly hubsService: HubsService,
    private readonly hubSerializerService: HubSerializerService,
    private readonly uploadHubLogoSerializerService: UploadHubLogoSerializerService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get a list of hubs by the specified filters and sorts',
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
  @ApiQuery({})
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
      tags_list,
      articles,
      tags,
      sorts,
      offset,
      limit,
    }: GetHubsQueryDTO,
  ): Promise<HubsListResponseDTO> {
    const hubsFilters = this.hubsService.prepareFilters({
      id,
      name,
      tags_list,
      articles,
      tags,
    });
    const hubsSorts = this.hubsService.prepareSorts(sorts);
    const [findMultipleStatus, findMultipleError, findMultipleResponse] =
      await this.hubsService.findMultiple(
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

  @Get(':id')
  @ApiOperation({ summary: 'Get hub data by id' })
  @ApiParam({ name: 'id', description: 'Hub id' })
  @ApiResponse({
    status: 200,
    type: HubResponseDTO,
    description: 'Hub data',
  })
  async getHub(
    @Param('id', ParseIntPipe) hubId: number,
  ): Promise<HubResponseDTO> {
    const [findOneStatus, findOneError, hub] = await this.hubsService.findOne(
      hubId,
    );

    if (!findOneStatus) {
      switch (findOneError) {
        case FindOneError.FindHubError:
        case FindOneError.HubNotExists:
          throw new InternalServerErrorException(GetHubException.FindHubError);
        default:
          throw new InternalServerErrorException(
            GetHubException.UnknownGetHubError,
          );
      }
    }

    return await this.hubSerializerService.serialize(hub);
  }

  @Post(':hubId/logo/upload')
  @HttpCode(200)
  @UseInterceptors(FastifyFileInterceptor('logo'))
  @ApiOperation({ summary: 'Upload hub logo image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadHubLogoRequestDTO })
  @ApiResponse({
    status: 200,
    type: UploadHubLogoResponseDTO,
    description: 'Uploaded hub logo data',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async uploadLogo(
    @Param('id', ParseIntPipe) hubId: number,
    @GetAuthUser() user: AuthUser,
    @FastifyUploadedFile() multipart: Multipart,
  ): Promise<UploadHubLogoResponseDTO> {
    const [uploadLogoStatus, uploadLogoError, uploadLogoResponse] =
      await this.hubsService.uploadLogo(hubId, user.id, multipart);

    if (!uploadLogoStatus) {
      switch (uploadLogoError) {
        case UploadHubLogoError.InvalidImageFile:
          throw new BadRequestException(
            UploadHubLogoException.InvalidImageFile,
          );
        case UploadHubLogoError.InvalidImageFileSize:
          throw new BadRequestException(
            UploadHubLogoException.InvalidImageFileSize,
          );
        case UploadHubLogoError.InvalidImageSize:
          throw new BadRequestException(
            UploadHubLogoException.InvalidImageSize,
          );
        case UploadHubLogoError.SaveTempFileError:
        case UploadHubLogoError.ReadTempFileError:
          throw new InternalServerErrorException(
            UploadHubLogoException.SaveTempFileError,
          );
        case UploadHubLogoError.UploadToAWSError:
          throw new InternalServerErrorException(
            UploadHubLogoException.UploadFileError,
          );
        default:
          throw new InternalServerErrorException(
            UploadHubLogoException.UnknownFileUploadError,
          );
      }
    }

    return await this.uploadHubLogoSerializerService.serialize(
      uploadLogoResponse,
    );
  }

  @Post(':hubId/logo/save')
  @HttpCode(200)
  @ApiOperation({ summary: 'Save selected image as hub logo' })
  async saveLogo() {

  }

  @Post()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Create a new hub.',
    description: 'Available only to administrators.',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateHubRequestDTO })
  @ApiResponse({
    status: 200,
    type: HubResponseDTO,
    description: 'Hub data',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async createHub(
    @Body() { name, description }: CreateHubRequestDTO,
  ): Promise<HubResponseDTO> {
    const [createHubStatus, createHubError, hub] =
      await this.hubsService.createHub(name, description);

    if (!createHubStatus) {
      switch (createHubError) {
        case CreateHubError.CreateHubError:
          throw new InternalServerErrorException(
            CreateHubException.CreateHubError,
          );
        case CreateHubError.HubNotCreated:
          throw new InternalServerErrorException(
            CreateHubException.HubNotCreated,
          );
        default:
          throw new InternalServerErrorException(
            CreateHubException.UnknownCreateHubError,
          );
      }
    }

    return await this.hubSerializerService.serialize(hub);
  }
}

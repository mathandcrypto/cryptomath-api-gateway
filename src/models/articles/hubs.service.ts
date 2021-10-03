import { Injectable, Logger } from '@nestjs/common';
import { HubsPackageService } from '@providers/grpc/articles/hubs-package.service';
import {
  Hub,
  HubsFilters,
  HubsSorts,
} from '@cryptomath/cryptomath-api-proto/types/articles';
import { HubsFiltersQuery } from './interfaces/query/hubs-filters.interface';
import { HubsSortsQuery } from './interfaces/query/hubs-sorts.interface';
import { FindMultipleError } from './enums/errors/find-multiple.enum';
import { HubsList } from './interfaces/hubs-list.interface';
import { FindOneError } from './enums/errors/find-one.enum';
import { CreateHubError } from './enums/errors/create-hub.error';
import { UploadHubLogoError } from './enums/errors/upload-hub-logo.enum';
import { SaveHubLogoError } from './enums/errors/save-hub-logo.enum';
import { sortOrderToProto } from '@common/helpers/sorts';
import { Multipart } from 'fastify-multipart';
import { ImageStorage } from '@common/shared/storage/image-storage.adapter';
import { StorageException } from '@common/shared/storage/exceptions/storage.exception';
import { AWSConfigService } from '@config/aws/config.service';
import { AWSObject } from '@common/interfaces/aws-object.interface';
import { createReadStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';

@Injectable()
export class HubsService {
  private readonly logger = new Logger(HubsService.name);

  constructor(
    private readonly hubsPackageService: HubsPackageService,
    private readonly awsConfigService: AWSConfigService,
    @InjectAwsService(S3) private readonly s3: S3,
  ) {}

  prepareFilters(filtersQuery: HubsFiltersQuery): HubsFilters {
    const filters = {} as HubsFilters;

    if (filtersQuery.id) {
      filters.id = { id: filtersQuery.id };
    }

    if (filtersQuery.name) {
      filters.name = { text: filtersQuery.name };
    }

    if (filtersQuery.tags_list) {
      filters.tagsList = { idList: filtersQuery.tags_list };
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

    if (filtersQuery.tags) {
      const {
        equals: tagsEquals,
        min: tagsMin,
        max: tagsMax,
      } = filtersQuery.tags;

      filters.tags = {
        equals: tagsEquals,
        min: tagsMin,
        max: tagsMax,
      };
    }

    return filters;
  }

  prepareSorts(sortsQuery?: HubsSortsQuery): HubsSorts {
    const sorts = {} as HubsSorts;

    if (sortsQuery) {
      if (sortsQuery.name) {
        sorts.name = { direction: sortOrderToProto(sortsQuery.name) };
      }

      if (sortsQuery.articles) {
        sorts.articles = { direction: sortOrderToProto(sortsQuery.articles) };
      }

      if (sortsQuery.tags) {
        sorts.tags = { direction: sortOrderToProto(sortsQuery.tags) };
      }
    }

    return sorts;
  }

  async findMultiple(
    filters: HubsFilters,
    sorts: HubsSorts,
    offset = 0,
    limit = 30,
  ): Promise<[boolean, FindMultipleError, HubsList]> {
    const [findHubsStatus, findHubsResponse] =
      await this.hubsPackageService.findHubs(filters, sorts, offset, limit);

    if (!findHubsStatus) {
      return [false, FindMultipleError.FindHubsError, null];
    }

    const { isHubsFound, limit: take, total, hubs } = findHubsResponse;

    if (!isHubsFound) {
      return [false, FindMultipleError.HubsNotFound, null];
    }

    return [
      true,
      null,
      {
        limit: take,
        total,
        hubs: hubs || [],
      },
    ];
  }

  async findOne(hubId: number): Promise<[boolean, FindOneError, Hub]> {
    const [findHubStatus, findHubResponse] =
      await this.hubsPackageService.findHub(hubId);

    if (!findHubStatus) {
      return [false, FindOneError.FindHubError, null];
    }

    const { isHubExists, hub } = findHubResponse;

    if (!isHubExists) {
      return [false, FindOneError.HubNotExists, null];
    }

    return [true, null, hub];
  }

  async uploadLogo(
    hubId: number,
    userId: number,
    multipart: Multipart,
  ): Promise<[boolean, UploadHubLogoError, AWSObject]> {
    const imageStorage = new ImageStorage(multipart.file, {
      allowedFormats: ['png', 'jpeg'],
    });

    const filePath = await imageStorage.init();

    if (!imageStorage.isValidImageFile) {
      return [false, UploadHubLogoError.InvalidImageFile, null];
    }

    if (!imageStorage.isValidImageFileSize) {
      return [false, UploadHubLogoError.InvalidImageFileSize, null];
    }

    if (!imageStorage.isValidImageSize) {
      return [false, UploadHubLogoError.InvalidImageSize, null];
    }

    try {
      const fileStream = createReadStream(filePath);

      fileStream.on('error', () => {
        return [false, UploadHubLogoError.ReadTempFileError, null];
      });

      const awsKey = `${this.awsConfigService.tmpObjectsPrefix}_${uuidv4()}.${
        imageStorage.imageExtension
      }`;
      const uploadResult = await this.s3
        .upload({
          Bucket: this.awsConfigService.hubsAssetsBucketName,
          Body: fileStream,
          Key: awsKey,
          ACL: 'public-read',
          Metadata: {
            source: 'tmp_hub_logo',
            hub: String(hubId),
            user: String(userId),
          },
        })
        .promise();

      return [
        true,
        null,
        {
          bucket: uploadResult.Bucket,
          key: uploadResult.Key,
          url: uploadResult.Location,
        },
      ];
    } catch (error) {
      this.logger.error(error);

      if (error instanceof StorageException) {
        return [false, UploadHubLogoError.SaveTempFileError, null];
      }

      return [false, UploadHubLogoError.UploadToAWSError, null];
    }
  }

  async saveLogo(
    hubId: number,
    userId: number,
    tmpKey: string,
  ): Promise<[boolean, SaveHubLogoError, AWSObject]> {
    if (!tmpKey.startsWith(this.awsConfigService.tmpObjectsPrefix)) {
      return [false, SaveHubLogoError.InvalidObjectKey, null];
    }

    const { hubsAssetsBucketName } = this.awsConfigService;
  }

  async createHub(
    name: string,
    description: string,
  ): Promise<[boolean, CreateHubError, Hub]> {
    const [createHubStatus, createHubResponse] =
      await this.hubsPackageService.createHub(name, description);

    if (!createHubStatus) {
      return [false, CreateHubError.CreateHubError, null];
    }

    const { isHubCreated, hub } = createHubResponse;

    if (!isHubCreated) {
      return [false, CreateHubError.HubNotCreated, null];
    }

    return [true, null, hub];
  }
}

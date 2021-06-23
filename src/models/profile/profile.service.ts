import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserPackageService } from '@providers/grpc/user/user-package.service';
import { AuthUser } from '@auth/interfaces/auth-user.interface';
import { AuthUserProfile } from './interfaces/auth-user-profile.interface';
import { GetUserProfileError } from './enums/errors/get-user-profile.enum';
import { UserProfile } from './interfaces/user-profile.interface';
import { InjectS3, S3 } from 'nestjs-s3';
import { Multipart } from 'fastify-multipart';
import { UploadAvatarError } from './enums/errors/upload-avatar.enum';
import { SaveAvatarError } from './enums/errors/save-avatar.enum';
import { CreateUserAvatarError } from './enums/errors/create-user-avatar.enum';
import { DeleteUserAvatarError } from './enums/errors/delete-user-avatar.enum';
import { Avatar } from 'cryptomath-api-proto/types/user';
import { ImageStorage } from '@common/shared/storage/adapters/image-storage.adapter';
import { StorageException } from '@common/shared/storage/exceptions/storage.exception';
import { AWSConfigService } from '@config/aws/config.service';
import { AWSObject } from '@common/interfaces/aws-object.interface';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    private readonly userPackageService: UserPackageService,
    private readonly awsConfigService: AWSConfigService,
    @Inject('IMAGE_STORAGE') private readonly imageStorage: ImageStorage,
    @InjectS3() private readonly s3: S3,
  ) {}

  async getAuthUserProfile(
    user: AuthUser,
  ): Promise<[boolean, AuthUserProfile]> {
    const userId = user.id;

    const [
      findProfileStatus,
      findProfileResponse,
    ] = await this.userPackageService.findProfile(userId);

    if (!findProfileStatus) {
      return [false, null];
    }

    const { isProfileExists, profile } = findProfileResponse;

    return [
      true,
      {
        ...user,
        profile: isProfileExists ? profile : null,
      },
    ];
  }

  async getUserProfile(
    userId: number,
  ): Promise<[boolean, GetUserProfileError, UserProfile]> {
    const [
      findUserStatus,
      findUserResponse,
    ] = await this.userPackageService.findOne(userId);

    if (!findUserStatus) {
      return [false, GetUserProfileError.FindUserError, null];
    }

    const { isUserExists, user } = findUserResponse;

    if (!isUserExists) {
      return [false, GetUserProfileError.UserNotExists, null];
    }

    const [
      findProfileStatus,
      findProfileResponse,
    ] = await this.userPackageService.findProfile(userId);

    if (!findProfileStatus) {
      return [false, GetUserProfileError.FindProfileError, null];
    }

    const { isProfileExists, profile } = findProfileResponse;

    return [
      true,
      null,
      {
        ...user,
        profile: isProfileExists ? profile : null,
      },
    ];
  }

  async uploadAvatar(
    multipart: Multipart,
  ): Promise<[boolean, UploadAvatarError, AWSObject]> {
    this.imageStorage.setMultipart(multipart);

    if (!this.imageStorage.isImageFile) {
      return [false, UploadAvatarError.InvalidImageFile, null];
    }

    this.imageStorage.setOptions({ width: 200, height: 200 });

    try {
      const fileStream = await this.imageStorage.getStream();

      fileStream.on('error', () => {
        return [false, UploadAvatarError.ReadResizedFileError, null];
      });

      const awsKey = `${this.awsConfigService.tmpObjectsPrefix}_${uuidv4()}${
        this.imageStorage.fileExtension
      }`;
      const uploadResult = await this.s3
        .upload({
          Bucket: this.awsConfigService.userAssetsBucketName,
          Body: fileStream,
          Key: awsKey,
          ACL: 'public-read',
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
        return [false, UploadAvatarError.ResizeFileError, null];
      }

      return [false, UploadAvatarError.UploadToAWSError, null];
    }
  }

  async saveAvatar(
    tmpKey: string,
  ): Promise<[boolean, SaveAvatarError, AWSObject]> {
    if (!tmpKey.startsWith(this.awsConfigService.tmpObjectsPrefix)) {
      return [false, SaveAvatarError.InvalidObjectKey, null];
    }

    const { userAssetsBucketName } = this.awsConfigService;

    try {
      await this.s3
        .headObject({
          Bucket: userAssetsBucketName,
          Key: tmpKey,
        })
        .promise();

      const newAwsKey = `${uuidv4()}${extname(tmpKey)}`;
      await this.s3
        .copyObject({
          Bucket: userAssetsBucketName,
          CopySource: `${userAssetsBucketName}/${tmpKey}`,
          Key: newAwsKey,
          ACL: 'public-read',
        })
        .promise();

      await this.s3
        .deleteObject({
          Bucket: userAssetsBucketName,
          Key: tmpKey,
        })
        .promise();

      return [
        true,
        null,
        {
          bucket: userAssetsBucketName,
          key: newAwsKey,
          url: this.awsConfigService.getUrlFromBucket(
            userAssetsBucketName,
            newAwsKey,
          ),
        },
      ];
    } catch (error) {
      this.logger.error(error);

      return [false, SaveAvatarError.SaveToAWSError, null];
    }
  }

  async deleteUserAvatar(
    userId: number,
    avatarId: number,
  ): Promise<[boolean, DeleteUserAvatarError, Avatar]> {
    const [
      deleteAvatarStatus,
      deleteAvatarResponse,
    ] = await this.userPackageService.deleteAvatar(userId, avatarId);

    if (!deleteAvatarStatus) {
      return [false, DeleteUserAvatarError.ErrorDeletingAvatar, null];
    }

    const { isAvatarDeleted, avatar } = deleteAvatarResponse;

    if (!isAvatarDeleted) {
      return [false, DeleteUserAvatarError.AvatarNotDeleted, null];
    }

    try {
      await this.s3.deleteObject({
        Bucket: this.awsConfigService.userAssetsBucketName,
        Key: avatar.key,
      });
    } catch (error) {
      this.logger.error(error);

      return [false, DeleteUserAvatarError.ErrorRemovingOldAvatarFromAWS, null];
    }

    return [true, null, avatar];
  }

  async createUserAvatar(
    userId: number,
    awsObject: AWSObject,
  ): Promise<[boolean, CreateUserAvatarError, Avatar]> {
    const [
      findAvatarStatus,
      findAvatarResponse,
    ] = await this.userPackageService.findAvatar(userId);

    if (!findAvatarStatus) {
      return [false, CreateUserAvatarError.FindAvatarError, null];
    }

    const { isAvatarExists, avatar } = findAvatarResponse;

    if (isAvatarExists) {
      const [deleteAvatarStatus] = await this.deleteUserAvatar(
        userId,
        avatar.id,
      );

      if (!deleteAvatarStatus) {
        return [false, CreateUserAvatarError.ErrorDeletingOldAvatar, null];
      }
    }

    const { key, url } = awsObject;

    const [
      createAvatarStatus,
      createAvatarResponse,
    ] = await this.userPackageService.createAvatar(userId, key, url);

    if (!createAvatarStatus) {
      return [false, CreateUserAvatarError.CreateAvatarError, null];
    }

    const {
      isAvatarCreated,
      isAvatarAlreadyExists,
      avatar: createdAvatar,
    } = createAvatarResponse;

    if (isAvatarAlreadyExists) {
      return [false, CreateUserAvatarError.AvatarAlreadyExists, null];
    } else if (!isAvatarCreated) {
      return [false, CreateUserAvatarError.AvatarNotCreated, null];
    }

    return [true, null, createdAvatar];
  }
}

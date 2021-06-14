import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserPackageService } from '@providers/grpc/user/user-package.service';
import { AuthUser } from '@auth/interfaces/auth-user.interface';
import { GetAuthUserProfileError } from './enums/get-auth-user-profile-error.enum';
import { AuthUserProfile } from './interfaces/auth-user-profile.interface';
import { GetUserProfileError } from './enums/get-user-profile-error.enum';
import { UserProfile } from './interfaces/user-profile.interface';
import { InjectS3, S3 } from 'nestjs-s3';
import { Multipart } from 'fastify-multipart';
import { ImageStorage } from '@common/shared/storage/adapters/image-storage.adapter';
import { UploadUserAvatarError } from '@models/profile/enums/upload-user-avatar-error.enum';
import { StorageException } from '@common/shared/storage/exceptions/storage.exception';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import { AWSConfigService } from '@config/aws/config.service';
import { v4 as uuidv4 } from 'uuid';

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
  ): Promise<[boolean, GetAuthUserProfileError, AuthUserProfile]> {
    const userId = user.id;

    const authUserProfileResponse = await Promise.all([
      this.userPackageService.findAvatar(userId),
      this.userPackageService.findProfile(userId),
    ]);

    const [findAvatarStatus, findAvatarResponse] = authUserProfileResponse[0];

    if (!findAvatarStatus) {
      return [false, GetAuthUserProfileError.FindAvatarError, null];
    }

    const [findProfileStatus, findProfileResponse] = authUserProfileResponse[1];

    if (!findProfileStatus) {
      return [false, GetAuthUserProfileError.FindProfileError, null];
    }

    const { isAvatarExists, avatar } = findAvatarResponse;
    const { isProfileExists, profile } = findProfileResponse;

    return [
      true,
      null,
      {
        ...user,
        avatar: isAvatarExists ? avatar : null,
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

    const userProfileResponse = await Promise.all([
      this.userPackageService.findAvatar(userId),
      this.userPackageService.findProfile(userId),
    ]);

    const [findAvatarStatus, findAvatarResponse] = userProfileResponse[0];

    if (!findAvatarStatus) {
      return [false, GetUserProfileError.FindAvatarError, null];
    }

    const [findProfileStatus, findProfileResponse] = userProfileResponse[1];

    if (!findProfileStatus) {
      return [false, GetUserProfileError.FindProfileError, null];
    }

    const { isAvatarExists, avatar } = findAvatarResponse;
    const { isProfileExists, profile } = findProfileResponse;

    return [
      true,
      null,
      {
        user,
        avatar: isAvatarExists ? avatar : null,
        profile: isProfileExists ? profile : null,
      },
    ];
  }

  async uploadUserAvatar(
    multipart: Multipart,
  ): Promise<[boolean, UploadUserAvatarError, ManagedUpload.SendData]> {
    this.imageStorage.setMultipart(multipart);

    if (!this.imageStorage.isImageFile) {
      return [false, UploadUserAvatarError.InvalidImageFile, null];
    }

    this.imageStorage.setOptions({ width: 200, height: 200 });

    try {
      const fileStream = await this.imageStorage.getStream();

      fileStream.on('error', () => {
        return [false, UploadUserAvatarError.ReadResizedFileError, null];
      });

      const awsKey = `${this.awsConfigService.tmpObjectsPrefix}_${uuidv4()}${
        this.imageStorage.fileExtension
      }`;
      const uploadResult = await this.s3
        .upload({
          Bucket: this.awsConfigService.userAssetsBucketName,
          Body: fileStream,
          Key: awsKey,
        })
        .promise();

      return [true, null, uploadResult];
    } catch (error) {
      this.logger.error(error);

      if (error instanceof StorageException) {
        return [false, UploadUserAvatarError.ResizeFileError, null];
      }

      return [false, UploadUserAvatarError.UploadToAWSError, null];
    }
  }
}

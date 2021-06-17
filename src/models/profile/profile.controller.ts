import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { GetAuthUserProfileError } from './enums/errors/get-auth-user-profile.enum';
import { GetAuthUserProfileException } from './constants/exceptions/get-auth-user-profile.exception';
import { ProfileResponseDTO } from './dto/profile-response.dto';
import { ProfileSerializerService } from './serializers/profile.serializer';
import { UploadAvatarError } from './enums/errors/upload-avatar.enum';
import { UploadAvatarException } from './constants/exceptions/upload-avatar.exception';
import { SaveAvatarError } from './enums/errors/save-avatar.enum';
import { CreateUserAvatarError } from './enums/errors/create-user-avatar.enum';
import { SaveAvatarException } from './constants/exceptions/save-avatar.exception';
import { DeleteUserAvatarError } from './enums/errors/delete-user-avatar.enum';
import { DeleteAvatarException } from './constants/exceptions/delete-avatar.exception';
import { UploadAvatarSerializerService } from './serializers/upload-avatar.serializer';
import { UploadAvatarRequestDTO } from './dto/upload-avatar-request.dto';
import { UploadAvatarResponseDTO } from './dto/upload-avatar-response.dto';
import { SaveAvatarRequestDTO } from './dto/save-avatar-request.dto';
import { AvatarResponseDTO } from './dto/avatar-response.dto';
import { AvatarSerializerService } from './serializers/avatar.serializer';
import { GetAuthUser } from '@common/decorators/get-auth-user.decorator';
import { AuthUser } from '@auth/interfaces/auth-user.interface';
import { FastifyFileInterceptor } from '@common/interceptors/fastify-file.interceptor';
import { FastifyUploadedFile } from '@common/decorators/fastify-uploaded-file.decorator';
import { Multipart } from 'fastify-multipart';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profileSerializerService: ProfileSerializerService,
    private readonly uploadAvatarSerializerService: UploadAvatarSerializerService,
    private readonly avatarSerializerService: AvatarSerializerService,
  ) {}

  @Get('/me')
  @ApiOperation({ summary: 'Get profile data of an authorized user' })
  @ApiResponse({
    status: 200,
    type: ProfileResponseDTO,
    description: 'Authorized user profile data',
  })
  async getProfile(@GetAuthUser() user: AuthUser): Promise<ProfileResponseDTO> {
    const [
      authUserProfileStatus,
      authUserProfileError,
      authUserProfileResponse,
    ] = await this.profileService.getAuthUserProfile(user);

    if (!authUserProfileStatus) {
      switch (authUserProfileError) {
        case GetAuthUserProfileError.FindAvatarError:
          throw new InternalServerErrorException(
            GetAuthUserProfileException.FindAvatarError,
          );
        case GetAuthUserProfileError.FindProfileError:
          throw new InternalServerErrorException(
            GetAuthUserProfileException.FindProfileError,
          );
        default:
          throw new InternalServerErrorException(
            GetAuthUserProfileException.UnknownProfileFindError,
          );
      }
    }

    return await this.profileSerializerService.serialize(
      authUserProfileResponse,
    );
  }

  @Post('avatar/upload')
  @HttpCode(200)
  @UseInterceptors(FastifyFileInterceptor('avatar'))
  @ApiOperation({ summary: 'Upload user avatar image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadAvatarRequestDTO })
  @ApiResponse({
    status: 200,
    type: UploadAvatarResponseDTO,
    description: 'Uploaded avatar data',
  })
  async uploadAvatar(
    @FastifyUploadedFile() multipart: Multipart,
  ): Promise<UploadAvatarResponseDTO> {
    const [
      uploadAvatarStatus,
      uploadAvatarError,
      uploadAvatarResponse,
    ] = await this.profileService.uploadAvatar(multipart);

    if (!uploadAvatarStatus) {
      switch (uploadAvatarError) {
        case UploadAvatarError.InvalidImageFile:
          throw new BadRequestException(UploadAvatarException.InvalidImageFile);
        case UploadAvatarError.ResizeFileError:
        case UploadAvatarError.ReadResizedFileError:
          throw new InternalServerErrorException(
            UploadAvatarException.ResizingImageFileError,
          );
        case UploadAvatarError.UploadToAWSError:
          throw new InternalServerErrorException(
            UploadAvatarException.UploadFileError,
          );
        default:
          throw new InternalServerErrorException(
            UploadAvatarException.UnknownFileUploadError,
          );
      }
    }

    return await this.uploadAvatarSerializerService.serialize(
      uploadAvatarResponse,
    );
  }

  @Post('avatar/save')
  @HttpCode(200)
  @ApiOperation({ summary: 'Save selected image as user avatar' })
  @ApiBody({ type: SaveAvatarRequestDTO })
  @ApiResponse({
    status: 200,
    type: AvatarResponseDTO,
    description: 'Avatar data',
  })
  async saveAvatar(
    @GetAuthUser() user: AuthUser,
    @Body() { key }: SaveAvatarRequestDTO,
  ): Promise<AvatarResponseDTO> {
    const [
      saveAvatarStatus,
      saveAvatarError,
      saveAvatarResponse,
    ] = await this.profileService.saveAvatar(key);

    if (!saveAvatarStatus) {
      switch (saveAvatarError) {
        case SaveAvatarError.InvalidObjectKey:
          throw new BadRequestException(SaveAvatarException.InvalidObjectKey);
        case SaveAvatarError.SaveToAWSError:
          throw new InternalServerErrorException(
            SaveAvatarException.SaveToStorageError,
          );
        default:
          throw new InternalServerErrorException(
            SaveAvatarException.UnknownErrorSavingToStorage,
          );
      }
    }

    const [
      saveUserAvatarStatus,
      saveUserAvatarError,
      saveUserAvatarResponse,
    ] = await this.profileService.createUserAvatar(user.id, saveAvatarResponse);

    if (!saveUserAvatarStatus) {
      switch (saveUserAvatarError) {
        case CreateUserAvatarError.FindAvatarError:
          throw new InternalServerErrorException(
            SaveAvatarException.FindAvatarError,
          );
        case CreateUserAvatarError.ErrorDeletingOldAvatar:
          throw new InternalServerErrorException(
            SaveAvatarException.ErrorDeletingOldAvatar,
          );
        case CreateUserAvatarError.CreateAvatarError:
        case CreateUserAvatarError.AvatarAlreadyExists:
          throw new InternalServerErrorException(
            SaveAvatarException.CreateAvatarError,
          );
        case CreateUserAvatarError.AvatarNotCreated:
          throw new InternalServerErrorException(
            SaveAvatarException.AvatarNotCreated,
          );
        default:
          throw new InternalServerErrorException(
            SaveAvatarException.UnknownCreateAvatarError,
          );
      }
    }

    return await this.avatarSerializerService.serialize(saveUserAvatarResponse);
  }

  @Delete('avatar/:id')
  @ApiOperation({ summary: 'Delete user avatar' })
  @ApiParam({ name: 'id', description: 'User avatar ID' })
  @ApiResponse({
    status: 200,
    type: AvatarResponseDTO,
    description: 'Avatar data',
  })
  async deleteAvatar(
    @GetAuthUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AvatarResponseDTO> {
    const [
      deleteUserStatus,
      deleteUserError,
      deleteUserResponse,
    ] = await this.profileService.deleteUserAvatar(user.id, id);

    if (!deleteUserStatus) {
      switch (deleteUserError) {
        case DeleteUserAvatarError.ErrorDeletingAvatar:
          throw new InternalServerErrorException(
            DeleteAvatarException.ErrorDeletingAvatar,
          );
        case DeleteUserAvatarError.AvatarNotDeleted:
          throw new InternalServerErrorException(
            DeleteAvatarException.AvatarNotDeleted,
          );
        case DeleteUserAvatarError.ErrorRemovingOldAvatarFromAWS:
          throw new InternalServerErrorException(
            DeleteAvatarException.ErrorRemovingOldAvatarFromStorage,
          );
        default:
          throw new InternalServerErrorException(
            DeleteAvatarException.UnknownDeleteAvatarError,
          );
      }
    }

    return await this.avatarSerializerService.serialize(deleteUserResponse);
  }
}

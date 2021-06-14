import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { GetAuthUserProfileError } from './enums/get-auth-user-profile-error.enum';
import { ProfileResponseDTO } from './dto/profile-response.dto';
import { ProfileSerializer } from './serializers/profile.serializer';
import { UploadUserAvatarError } from './enums/upload-user-avatar-error.enum';
import { UploadAvatarSerializer } from './serializers/upload-avatar.serializer';
import { UploadAvatarResponseDTO } from './dto/upload-avatar-response.dto';
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
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profileSerializer: ProfileSerializer,
    private readonly uploadAvatarSerializer: UploadAvatarSerializer,
  ) {}

  @Get('/me')
  @ApiOperation({ summary: 'Get profile data of an authorized user' })
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
            'Failed to find authorized user avatar',
          );
        case GetAuthUserProfileError.FindProfileError:
          throw new InternalServerErrorException(
            'Failed to find authorized user profile',
          );
        default:
          throw new InternalServerErrorException(
            'Unknown get authorized user profile error',
          );
      }
    }

    return await this.profileSerializer.serialize(authUserProfileResponse);
  }

  @Post('avatar')
  @HttpCode(200)
  @UseInterceptors(FastifyFileInterceptor('avatar'))
  @ApiOperation({ summary: 'Upload user avatar image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatar(
    @GetAuthUser() user: AuthUser,
    @FastifyUploadedFile() multipart: Multipart,
  ): Promise<UploadAvatarResponseDTO> {
    const [
      uploadAvatarStatus,
      uploadAvatarError,
      uploadAvatarResponse,
    ] = await this.profileService.uploadUserAvatar(multipart);

    if (!uploadAvatarStatus) {
      switch (uploadAvatarError) {
        case UploadUserAvatarError.InvalidImageFile:
          throw new BadRequestException('Invalid image file');
        case UploadUserAvatarError.ResizeFileError:
        case UploadUserAvatarError.ReadResizedFileError:
          throw new InternalServerErrorException('Resizing image file error');
        case UploadUserAvatarError.UploadToAWSError:
          throw new InternalServerErrorException('Upload file error');
        default:
          throw new InternalServerErrorException('Unknown upload file error');
      }
    }

    return await this.uploadAvatarSerializer.serialize(uploadAvatarResponse);
  }
}

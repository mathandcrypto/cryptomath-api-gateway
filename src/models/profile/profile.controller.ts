import {
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { GetAuthUserProfileError } from './enums/get-auth-user-profile-error.enum';
import { ProfileResponseDTO } from './dto/profile-response.dto';
import { ProfileSerializer } from './serializers/profile.serializer';
import { GetAuthUser } from '@common/decorators/get-auth-user.decorator';
import { AuthUser } from '@auth/interfaces/auth-user.interface';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profileSerializer: ProfileSerializer,
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
}

import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { AuthUserProfile } from '../interfaces/auth-user-profile.interface';
import { AuthUserProfileResponseDTO } from '../dto/response/auth-user-profile.dto';

@Injectable()
export class ProfileSerializerService extends BaseSerializerService<
  AuthUserProfile,
  AuthUserProfileResponseDTO
> {
  async serialize(
    authUserProfile: AuthUserProfile,
  ): Promise<AuthUserProfileResponseDTO> {
    return {
      ...authUserProfile,
      bio: authUserProfile.profile?.bio,
      url: authUserProfile.profile?.url,
      location: authUserProfile.profile?.location,
    };
  }
}

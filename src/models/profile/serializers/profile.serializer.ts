import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { AuthUserProfile } from '../interfaces/auth-user-profile.interface';
import { ProfileResponseDTO } from '../dto/profile-response.dto';

@Injectable()
export class ProfileSerializer extends BaseSerializerService<
  AuthUserProfile,
  ProfileResponseDTO
> {
  async serialize(authUserProfile: AuthUserProfile) {
    return {
      id: authUserProfile.id,
      email: authUserProfile.email,
      role: authUserProfile.role,
      display_name: authUserProfile.displayName,
      avatar_url: authUserProfile.avatar?.url,
      bio: authUserProfile.profile?.bio,
      url: authUserProfile.profile?.url,
      location: authUserProfile.profile?.location,
    };
  }
}

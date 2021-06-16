import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { AuthUserProfile } from '../interfaces/auth-user-profile.interface';
import { ProfileResponseDTO } from '../dto/profile-response.dto';
import { AvatarSerializerService } from './avatar.serializer';

@Injectable()
export class ProfileSerializerService extends BaseSerializerService<
  AuthUserProfile,
  ProfileResponseDTO
> {
  constructor(
    private readonly avatarSerializerService: AvatarSerializerService,
  ) {
    super();
  }

  async serialize(authUserProfile: AuthUserProfile) {
    return {
      id: authUserProfile.id,
      email: authUserProfile.email,
      role: authUserProfile.role,
      display_name: authUserProfile.displayName,
      avatar: authUserProfile.avatar
        ? await this.avatarSerializerService.serialize(authUserProfile.avatar)
        : null,
      bio: authUserProfile.profile?.bio,
      url: authUserProfile.profile?.url,
      location: authUserProfile.profile?.location,
    };
  }
}

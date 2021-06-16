import { BaseSerializerService } from '@common/serializers/base.serializer';
import { Avatar } from 'cryptomath-api-proto/types/user';
import { AvatarResponseDTO } from '../dto/avatar-response.dto';

export class AvatarSerializerService extends BaseSerializerService<
  Avatar,
  AvatarResponseDTO
> {
  async serialize(avatar: Avatar) {
    return {
      id: avatar.id,
      url: avatar.url,
    };
  }
}

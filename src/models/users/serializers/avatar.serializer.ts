import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { Avatar as AvatarProto } from 'cryptomath-api-proto/types/user';
import { Avatar } from '../interfaces/avatar.interface';

@Injectable()
export class AvatarSerializerService extends BaseSerializerService<
  AvatarProto,
  Avatar
> {
  async serialize(avatar: AvatarProto) {
    return {
      id: avatar.id,
      url: avatar.url,
    };
  }
}

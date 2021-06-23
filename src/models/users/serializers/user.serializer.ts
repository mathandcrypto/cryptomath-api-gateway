import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { User as UserProto } from 'cryptomath-api-proto/types/user';
import { User } from '../interfaces/user.interface';
import { RoleSerializerService } from './role.serializer';
import { AvatarSerializerService } from './avatar.serializer';
import { fromUnixTime } from 'date-fns';

@Injectable()
export class UserSerializerService extends BaseSerializerService<
  UserProto,
  User
> {
  constructor(
    private readonly roleSerializerService: RoleSerializerService,
    private readonly avatarSerializerService: AvatarSerializerService,
  ) {
    super();
  }

  async serialize(user: UserProto): Promise<User> {
    return {
      id: user.id,
      display_name: user.displayName,
      role: await this.roleSerializerService.serialize(user.role),
      reputation: user.reputation,
      avatar: user.avatar
        ? await this.avatarSerializerService.serialize(user.avatar)
        : null,
      created_at: fromUnixTime(user.createdAt),
    };
  }
}

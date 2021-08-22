import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { User } from '@cryptomath/cryptomath-api-proto/types/user';
import { AuthUser } from '../interfaces/auth-user.interface';
import { RoleSerializerService } from '@models/users/serializers/role.serializer';
import { AvatarSerializerService } from '@models/users/serializers/avatar.serializer';
import { fromUnixTime } from 'date-fns';

@Injectable()
export class AuthUserSerializerService extends BaseSerializerService<
  User,
  AuthUser
> {
  constructor(
    private readonly roleSerializerService: RoleSerializerService,
    private readonly avatarSerializerService: AvatarSerializerService,
  ) {
    super();
  }

  async serialize(user: User): Promise<AuthUser> {
    return {
      id: user.id,
      email: user.email,
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

import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { User } from 'cryptomath-api-proto/types/user';
import { AuthUser } from '../interfaces/auth-user.interface';
import { RoleSerializerService } from '@auth/serializers/role.serializer';

@Injectable()
export class AuthUserSerializerService extends BaseSerializerService<
  User,
  AuthUser
> {
  constructor(private readonly roleSerializerService: RoleSerializerService) {
    super();
  }

  async serialize(user: User) {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: await this.roleSerializerService.serialize(user.role),
    };
  }
}

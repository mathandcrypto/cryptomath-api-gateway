import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '@common/serializers/base.serializer';
import { Role as RoleProto } from 'cryptomath-api-proto/types/user';
import { Role } from '@common/enums/role.enum';

@Injectable()
export class RoleSerializerService extends BaseSerializerService<
  RoleProto,
  Role
> {
  async serialize(role: RoleProto): Promise<Role> {
    switch (role) {
      case RoleProto.ADMIN:
        return Role.Admin;
      case RoleProto.MODERATOR:
        return Role.Moderator;
    }

    return Role.User;
  }
}

import { Module } from '@nestjs/common';
import { UserPackageModule } from '@providers/grpc/user/user-package.module';
import { AvatarSerializerService } from './serializers/avatar.serializer';
import { RoleSerializerService } from './serializers/role.serializer';
import { UserSerializerService } from './serializers/user.serializer';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [UserPackageModule],
  providers: [
    AvatarSerializerService,
    RoleSerializerService,
    UserSerializerService,
    UsersService,
  ],
  controllers: [UsersController],
  exports: [
    AvatarSerializerService,
    RoleSerializerService,
    UserSerializerService,
    UsersService,
  ],
})
export class UsersModule {}

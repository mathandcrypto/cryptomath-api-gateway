import { Module } from '@nestjs/common';
import { UserPackageModule } from '@providers/grpc/user/user-package.module';
import { UsersController } from './users.controller';

@Module({
  imports: [UserPackageModule],
  controllers: [UsersController],
})
export class UsersModule {}

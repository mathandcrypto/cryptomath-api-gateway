import { Module } from '@nestjs/common';
import { UserPackageModule } from '@providers/grpc/user/user-package.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [UserPackageModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

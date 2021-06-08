import { Module } from '@nestjs/common';
import { UserPackageModule } from '@providers/grpc/user/user-package.module';
import { MailerModule } from '@providers/rmq/mailer/mailer.module';
import { UsersController } from './users.controller';

@Module({
  imports: [UserPackageModule, MailerModule],
  controllers: [UsersController],
})
export class UsersModule {}

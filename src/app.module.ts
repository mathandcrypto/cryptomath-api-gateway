import { Module } from '@nestjs/common';
import { AppConfigModule } from '@config/app/config.module';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@models/users/users.module';

@Module({
  imports: [AppConfigModule, AuthModule, UsersModule],
})
export class AppModule {}

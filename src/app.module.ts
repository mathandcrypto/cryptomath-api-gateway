import { Module } from '@nestjs/common';
import { AppConfigModule } from '@config/app/config.module';
import { AuthModule } from '@auth/auth.module';
import { CaptchaModule } from '@models/captcha/captcha.module';
import { UsersModule } from '@models/users/users.module';
import { ProfileModule } from '@models/profile/profile.module';
import { ArticlesModule } from '@models/articles/articles.module';
import { SearchModule } from '@models/search/search.module';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    CaptchaModule,
    UsersModule,
    ProfileModule,
    ArticlesModule,
    SearchModule,
  ],
})
export class AppModule {}

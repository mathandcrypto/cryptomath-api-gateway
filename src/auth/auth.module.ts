import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtConfigModule } from '@config/jwt/config.module';
import { JwtConfigService } from '@config/jwt/config.service';
import { JwtModule } from '@nestjs/jwt';
import { UserPackageModule } from '@providers/grpc/user/user-package.module';
import { AuthPackageModule } from '@providers/grpc/auth/auth-package.module';
import { MailerModule } from '@providers/rmq/mailer/mailer.module';
import { UsersModule } from '@models/users/users.module';
import { CaptchaModule } from '@models/captcha/captcha.module';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthUserSerializerService } from './serializers/auth-user.serializer';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    UsersModule,
    CaptchaModule,
    JwtConfigModule,
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      inject: [JwtConfigService],
      useFactory: (jwtConfigService: JwtConfigService) => {
        const {
          accessTokenSecret,
          accessTokenExpirationTime,
        } = jwtConfigService;

        return {
          secret: accessTokenSecret,
          signOptions: { expiresIn: accessTokenExpirationTime },
        };
      },
    }),
    UserPackageModule,
    AuthPackageModule,
    MailerModule,
  ],
  providers: [
    AuthService,
    TokenService,
    LocalStrategy,
    JwtStrategy,
    AuthUserSerializerService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

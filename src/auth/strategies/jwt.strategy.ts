import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtConfigService } from '@config/jwt/config.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthPackageService } from '@providers/grpc/auth/auth-package.service';
import { UserPackageService } from '@providers/grpc/user/user-package.service';
import { AuthUserSerializerService } from '../serializers/auth-user.serializer';
import { AuthUser } from '../interfaces/auth-user.interface';
import { JwtStrategyException } from '../constants/exceptions/jwt-strategy.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtConfigService: JwtConfigService,
    private readonly authPackageService: AuthPackageService,
    private readonly userPackageService: UserPackageService,
    private readonly authUserSerializerService: AuthUserSerializerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfigService.accessTokenSecret,
    });
  }

  async validate({ id, secret }: JwtPayload): Promise<AuthUser> {
    const [validateStatus, validateAuthSessionResponse] =
      await this.authPackageService.validateAccessSession(id, secret);

    if (!validateStatus) {
      throw new InternalServerErrorException(
        JwtStrategyException.ValidateAccessSessionError,
      );
    }

    const { isSessionExists, isSessionExpired } = validateAuthSessionResponse;

    if (!isSessionExists) {
      throw new UnauthorizedException(
        JwtStrategyException.AccessSessionNotExists,
      );
    } else if (isSessionExpired) {
      throw new UnauthorizedException(
        JwtStrategyException.AccessSessionExpired,
      );
    }

    const [findUserStatus, findUserResponse] =
      await this.userPackageService.findOne(id);

    if (!findUserStatus) {
      throw new InternalServerErrorException(
        JwtStrategyException.FindUserError,
      );
    }

    const { isUserExists, user } = findUserResponse;

    if (!isUserExists) {
      throw new UnauthorizedException(JwtStrategyException.UserNotExists);
    }

    return await this.authUserSerializerService.serialize(user);
  }
}

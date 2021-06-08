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

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtConfigService: JwtConfigService,
    private readonly authPackageService: AuthPackageService,
    private readonly userPackageService: UserPackageService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfigService.accessTokenSecret,
    });
  }

  async validate({ id, secret }: JwtPayload) {
    const [
      validateStatus,
      validateAuthSessionResponse,
    ] = await this.authPackageService.validateAccessSession(id, secret);

    if (!validateStatus) {
      throw new InternalServerErrorException(
        'Error requesting the auth service',
      );
    }

    const { isSessionExists, isSessionExpired } = validateAuthSessionResponse;

    if (!isSessionExists) {
      throw new UnauthorizedException(
        'Auth session with this user id and secret was not found',
      );
    } else if (isSessionExpired) {
      throw new UnauthorizedException('Auth session expired');
    }

    const [
      findUserStatus,
      findUserResponse,
    ] = await this.userPackageService.findOne(id);

    if (!findUserStatus) {
      throw new InternalServerErrorException(
        'Error requesting the user service',
      );
    }

    const { isUserExists, user } = findUserResponse;

    if (!isUserExists) {
      throw new UnauthorizedException('User with this id does not exist');
    }

    return { id: user.id, email: user.email };
  }
}

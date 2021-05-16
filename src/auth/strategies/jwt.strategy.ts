import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtConfigService } from '@config/jwt/config.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from '@auth/auth.service';
import { UsersService } from '@models/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtConfigService: JwtConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
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
    ] = await this.authService.validateAuthSession(id, secret);

    if (!validateStatus) {
      throw new InternalServerErrorException(
        'Error requesting the auth service',
      );
    } else {
      const { isSessionExists, isSessionExpired } = validateAuthSessionResponse;

      if (!isSessionExists) {
        throw new UnauthorizedException(
          'Auth session with this user id and secret was not found',
        );
      } else if (isSessionExpired) {
        throw new UnauthorizedException('Auth session expired');
      }
    }

    const [findUserStatus, findUserResponse] = await this.usersService.findOne(
      id,
    );

    if (!findUserStatus) {
      throw new InternalServerErrorException(
        'Error requesting the user service',
      );
    } else {
      const { isUserExists, user } = findUserResponse;

      if (!isUserExists) {
        throw new UnauthorizedException('User with this id does not exist');
      }

      return user;
    }
  }
}

import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { UserPackageService } from '@providers/grpc/user/user-package.service';
import { AuthUserSerializerService } from '../serializers/auth-user.serializer';
import { AuthUser } from '../interfaces/auth-user.interface';
import { LocalStrategyException } from '../constants/exceptions/local-strategy.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userPackageService: UserPackageService,
    private readonly authUserSerializerService: AuthUserSerializerService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<AuthUser> {
    const [validateStatus, validateUserResponse] =
      await this.userPackageService.findByEmailAndPassword(email, password);

    if (!validateStatus) {
      throw new InternalServerErrorException(
        LocalStrategyException.FindUserError,
      );
    }

    const { isUserExists, isValidPassword, user } = validateUserResponse;

    if (!isUserExists) {
      throw new UnauthorizedException(LocalStrategyException.UserNotExists);
    } else if (!isValidPassword) {
      throw new UnauthorizedException(LocalStrategyException.InvalidPassword);
    }

    return await this.authUserSerializerService.serialize(user);
  }
}

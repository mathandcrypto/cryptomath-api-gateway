import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { UserPackageService } from '@providers/grpc/user/user-package.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userPackageService: UserPackageService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const [
      validateStatus,
      validateUserResponse,
    ] = await this.userPackageService.findByEmailAndPassword(
      email,
      password,
    );

    if (!validateStatus) {
      throw new InternalServerErrorException(
        'Error requesting the user service',
      );
    }

    const { isUserExists, isValidPassword, user } = validateUserResponse;

    if (!isUserExists) {
      throw new UnauthorizedException('User with this email was not found');
    } else if (!isValidPassword) {
      throw new UnauthorizedException('Invalid user password');
    }

    return { id: user.id, email: user.email };
  }
}

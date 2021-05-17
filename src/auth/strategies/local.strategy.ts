import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string) {
    const [
      validateStatus,
      validateUserResponse,
    ] = await this.authService.validateUser(username, password);

    if (!validateStatus) {
      throw new InternalServerErrorException(
        'Error requesting the user service',
      );
    } else {
      const { isUserExists, isValidPassword, user } = validateUserResponse;

      if (!isUserExists) {
        throw new UnauthorizedException('User with this email was not found');
      } else if (!isValidPassword) {
        throw new UnauthorizedException('Invalid user password');
      }

      return { id: user.id, email: user.email };
    }
  }
}

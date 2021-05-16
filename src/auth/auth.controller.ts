import {
  Controller,
  UseGuards,
  Post,
  HttpCode,
  Body,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthCredentialsRequestDTO } from './dto/auth-credentials-request.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  async login(@Body() { email, password }: AuthCredentialsRequestDTO) {
    const [isLoggedIn, errorType, loginResponse] = await this.authService.login(
      email,
      password,
    );

    if (!isLoggedIn) {
      switch (errorType) {
        case 'user_request_error':
          throw new InternalServerErrorException(
            'Error requesting the user service',
          );
        case 'user_not_exists':
          throw new UnauthorizedException('User with this email was not found');
        case 'invalid_password':
          throw new UnauthorizedException('Invalid user password');
        case 'auth_request_error':
          throw new InternalServerErrorException(
            'Error requesting the auth service',
          );
        case 'auth_session_not_created':
          throw new InternalServerErrorException(
            'Failed to create auth session',
          );
        default:
          throw new InternalServerErrorException('Authorization error');
      }
    }

    const { userId, accessSecret, refreshSecret } = loginResponse;

    const accessToken = await this.tokenService.generateAccessToken(
      userId,
      email,
      accessSecret,
    );
    const refreshToken = await this.tokenService.generateRefreshToken(
      userId,
      email,
      refreshSecret,
    );

    return {
      token_type: 'bearer',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}

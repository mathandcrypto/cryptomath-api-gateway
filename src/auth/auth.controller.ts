import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginErrorType } from './enums/login-error-type.enum';
import { RefreshErrorType } from './enums/refresh-error-type.enum';
import { LogoutErrorType } from './enums/logout-error-type.enum';
import { TokenService } from './token.service';
import { DecodeRefreshTokenErrorType } from './enums/decode-refresh-token-error-type.enum';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginRequestDTO } from './dto/login-request.dto';
import { RefreshRequestDTO } from './dto/refresh-request.dto';
import { ResolveRefreshTokenErrorType } from '@auth/enums/resolve-refresh-token-error-type.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  async login(@Body() { email, password }: LoginRequestDTO) {
    const [
      loginStatus,
      errorType,
      loginResponse,
    ] = await this.authService.login(email, password);

    if (!loginStatus) {
      switch (errorType) {
        case LoginErrorType.FindUserError:
          throw new InternalServerErrorException('Failed to find user');
        case LoginErrorType.UserNotExists:
          throw new UnauthorizedException('User with this email was not found');
        case LoginErrorType.InvalidPassword:
          throw new UnauthorizedException('Invalid user password');
        case LoginErrorType.CreateAccessSessionError:
          throw new InternalServerErrorException(
            'Failed to create access session',
          );
        case LoginErrorType.AccessSessionNotCreated:
          throw new InternalServerErrorException('Access session not created');
        case LoginErrorType.RefreshSessionNotCreated:
          throw new InternalServerErrorException('Refresh session not created');
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

  @Post('/refresh')
  @HttpCode(200)
  async refresh(@Body() { refresh_token }: RefreshRequestDTO) {
    const [
      resolveStatus,
      resolveErrorType,
      resolveResponse,
    ] = await this.tokenService.resolveRefreshToken(refresh_token);

    if (!resolveStatus) {
      switch (resolveErrorType) {
        case DecodeRefreshTokenErrorType.TokenExpired:
          throw new UnauthorizedException('Refresh token expired');
        case DecodeRefreshTokenErrorType.TokenMalformed:
          throw new UnauthorizedException('Refresh token malformed');
        case ResolveRefreshTokenErrorType.ValidateRefreshSessionError:
          throw new UnauthorizedException('Failed to validate refresh session');
        case ResolveRefreshTokenErrorType.RefreshSessionNotExists:
          throw new UnauthorizedException('Refresh session does not exist');
        case ResolveRefreshTokenErrorType.RefreshSessionExpired:
          throw new UnauthorizedException('Refresh session expired');
        default:
          throw new InternalServerErrorException(
            'Failed to resolve refresh token',
          );
      }
    }

    const { userId, refreshSecret, email } = resolveResponse;
    const [
      refreshStatus,
      refreshErrorType,
      refreshResponse,
    ] = await this.authService.refresh(userId, refreshSecret);

    if (!refreshStatus) {
      switch (refreshErrorType) {
        case RefreshErrorType.DeleteRefreshSessionError:
          throw new InternalServerErrorException(
            'Failed to delete refresh session',
          );
        case RefreshErrorType.RefreshSessionNotDeleted:
          throw new InternalServerErrorException('Refresh session not deleted');
        case RefreshErrorType.CreateAccessSessionError:
          throw new InternalServerErrorException(
            'Failed to create access session',
          );
        case RefreshErrorType.AccessSessionNotCreated:
          throw new InternalServerErrorException('Access session not created');
        case RefreshErrorType.RefreshSessionNotCreated:
          throw new InternalServerErrorException('Refresh session not created');
        default:
          throw new InternalServerErrorException(
            'Failed to refresh auth sessions',
          );
      }
    }

    const { accessSecret, refreshSecret: newRefreshSecret } = refreshResponse;
    const accessToken = await this.tokenService.generateAccessToken(
      userId,
      email,
      accessSecret,
    );
    const refreshToken = await this.tokenService.generateRefreshToken(
      userId,
      email,
      newRefreshSecret,
    );

    return {
      token_type: 'bearer',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(200)
  async logout(@Req() request) {
    const userId = request.user.id;

    const [logoutStatus, logoutErrorType] = await this.authService.logout(
      userId,
    );

    if (!logoutStatus) {
      switch (logoutErrorType) {
        case LogoutErrorType.DeleteAllUserSessionsError:
          throw new InternalServerErrorException(
            'Failed to delete all user sessions',
          );
        case LogoutErrorType.SessionsNotDeleted:
          throw new InternalServerErrorException('User sessions not deleted');
        default:
          throw new InternalServerErrorException('Unknown logout error');
      }
    }
  }
}

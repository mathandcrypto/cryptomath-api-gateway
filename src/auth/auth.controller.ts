import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginError } from './enums/login-error.enum';
import { RefreshError } from './enums/refresh-error.enum';
import { LogoutError } from './enums/logout-error.enum';
import { RegisterError } from './enums/register-error.enum';
import { TokenService } from './token.service';
import { DecodeJwtTokenError } from '@common/enums/errors/decode-jwt-token-error.enum';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { LoginRequestDTO } from './dto/login-request.dto';
import { RefreshRequestDTO } from './dto/refresh-request.dto';
import { RegisterRequestDTO } from './dto/register-request.dto';
import { ResolveRefreshTokenError } from './enums/resolve-refresh-token-error.enum';
import { CaptchaService } from '@models/captcha/captcha.service';
import { UsersService } from '@models/users/users.service';
import { ValidateAnswerError } from '@models/captcha/enums/validate-answer-error.enum';
import { RegisterExceptionError } from './enums/register-exception-error.enum';
import { GetUserProfileError } from '@models/users/enums/get-user-profile-error.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly captchaService: CaptchaService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  async login(@Body() { email, password }: LoginRequestDTO) {
    const [
      loginStatus,
      loginError,
      loginResponse,
    ] = await this.authService.login(email, password);

    if (!loginStatus) {
      switch (loginError) {
        case LoginError.FindUserError:
          throw new InternalServerErrorException('Failed to find user');
        case LoginError.UserNotExists:
          throw new UnauthorizedException('User with this email was not found');
        case LoginError.InvalidPassword:
          throw new UnauthorizedException('Invalid user password');
        case LoginError.CreateAccessSessionError:
          throw new InternalServerErrorException(
            'Failed to create access session',
          );
        case LoginError.AccessSessionNotCreated:
          throw new InternalServerErrorException('Access session not created');
        case LoginError.RefreshSessionNotCreated:
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
      resolveError,
      resolveResponse,
    ] = await this.tokenService.resolveRefreshToken(refresh_token);

    if (!resolveStatus) {
      switch (resolveError) {
        case DecodeJwtTokenError.TokenExpired:
          throw new UnauthorizedException('Refresh token expired');
        case DecodeJwtTokenError.TokenMalformed:
          throw new UnauthorizedException('Refresh token malformed');
        case ResolveRefreshTokenError.ValidateRefreshSessionError:
          throw new UnauthorizedException('Failed to validate refresh session');
        case ResolveRefreshTokenError.RefreshSessionNotExists:
          throw new UnauthorizedException('Refresh session does not exist');
        case ResolveRefreshTokenError.RefreshSessionExpired:
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
      refreshError,
      refreshResponse,
    ] = await this.authService.refresh(userId, refreshSecret);

    if (!refreshStatus) {
      switch (refreshError) {
        case RefreshError.DeleteRefreshSessionError:
          throw new InternalServerErrorException(
            'Failed to delete refresh session',
          );
        case RefreshError.RefreshSessionNotDeleted:
          throw new InternalServerErrorException('Refresh session not deleted');
        case RefreshError.CreateAccessSessionError:
          throw new InternalServerErrorException(
            'Failed to create access session',
          );
        case RefreshError.AccessSessionNotCreated:
          throw new InternalServerErrorException('Access session not created');
        case RefreshError.RefreshSessionNotCreated:
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

    const [logoutStatus, logoutError] = await this.authService.logout(userId);

    if (!logoutStatus) {
      switch (logoutError) {
        case LogoutError.DeleteAllUserSessionsError:
          throw new InternalServerErrorException(
            'Failed to delete all user sessions',
          );
        case LogoutError.SessionsNotDeleted:
          throw new InternalServerErrorException('User sessions not deleted');
        default:
          throw new InternalServerErrorException('Unknown logout error');
      }
    }
  }

  @UseGuards(GuestGuard)
  @Post('register')
  @HttpCode(200)
  async register(
    @Body()
    {
      captcha_token: captchaToken,
      captcha_answer: captchaAnswer,
      display_name: displayName,
      email,
      password,
    }: RegisterRequestDTO,
  ) {
    const [
      validateStatus,
      validateErrorType,
      isAnswerCorrect,
    ] = await this.captchaService.validateAnswer(captchaToken, captchaAnswer);

    if (!validateStatus) {
      switch (validateErrorType) {
        case DecodeJwtTokenError.TokenExpired:
          throw new ForbiddenException({
            error: RegisterExceptionError.CaptchaTokenExpired,
            message: 'Captcha token expired',
          });
        case DecodeJwtTokenError.TokenMalformed:
          throw new ForbiddenException({
            error: RegisterExceptionError.CaptchaTokenMalformed,
            message: 'Captcha token malformed',
          });
        case ValidateAnswerError.ValidateTaskError:
          throw new InternalServerErrorException({
            error: RegisterExceptionError.CaptchaValidateTaskError,
            message: 'Failed to validate captcha answer',
          });
        case ValidateAnswerError.TaskNotFound:
          throw new ForbiddenException({
            error: RegisterExceptionError.CaptchaTaskNotFound,
            message: 'Captcha task not found',
          });
        default:
          throw new InternalServerErrorException({
            error: RegisterExceptionError.CaptchaUnknownError,
            message: 'Unknown captcha validation error',
          });
      }
    } else if (!isAnswerCorrect) {
      throw new ForbiddenException({
        error: RegisterExceptionError.WrongCaptchaAnswer,
        message: 'Wrong answer to captcha task',
      });
    }

    const [
      registerStatus,
      registerError,
      registerResponse,
    ] = await this.authService.register(displayName, email, password);

    if (!registerStatus) {
      switch (registerError) {
        case RegisterError.CreateUserError:
          throw new InternalServerErrorException({
            error: RegisterExceptionError.CreateUserError,
            message: 'Failed to create user',
          });
        case RegisterError.UserNotCreated:
          throw new InternalServerErrorException({
            error: RegisterExceptionError.UserNotCreated,
            message: 'User not created',
          });
        case RegisterError.UserAlreadyExists:
          throw new ForbiddenException({
            error: RegisterExceptionError.UserAlreadyExists,
            message: 'A user with this email already exists',
          });
        case RegisterError.SentNotifyMailError:
          throw new InternalServerErrorException({
            error: RegisterExceptionError.SentNotifyMailError,
            message: 'Failed to sent registration notify mail',
          });
        default:
          throw new InternalServerErrorException({
            error: RegisterExceptionError.CreateUserUnknownError,
            message: 'Unknown user creation error',
          });
      }
    }

    const { userId } = registerResponse;

    return {
      user_id: userId,
      email,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUser(@Req() request) {
    const userId = request.user.id;

    const [
      userProfileStatus,
      userProfileError,
      userProfileResponse,
    ] = await this.usersService.getUserProfile(userId);

    if (!userProfileStatus) {
      switch (userProfileError) {
        case GetUserProfileError.FindUserError:
          throw new InternalServerErrorException('Failed to find user');
        case GetUserProfileError.UserNotExists:
          throw new UnauthorizedException('User does not exist');
        case GetUserProfileError.FindAvatarError:
          throw new InternalServerErrorException('Failed to find user avatar');
        default:
          throw new InternalServerErrorException('Unknown get profile error');
      }
    }

    return userProfileResponse;
  }
}

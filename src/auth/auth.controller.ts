import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginError } from './enums/errors/login.enum';
import { LoginException } from './constants/exceptions/login.exception';
import { RefreshError } from './enums/errors/refresh.enum';
import { RefreshException } from './constants/exceptions/refresh.exception';
import { LogoutError } from './enums/errors/logout.enum';
import { LogoutException } from './constants/exceptions/logout.exception';
import { RegisterError } from './enums/errors/register.enum';
import { RegisterException } from './constants/exceptions/register.exception';
import { TokenService } from './token.service';
import { DecodeJwtTokenError } from '@common/enums/errors/decode-jwt-token.enum';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { LoginRequestDTO } from './dto/login-request.dto';
import { RefreshRequestDTO } from './dto/refresh-request.dto';
import { RegisterRequestDTO } from './dto/register-request.dto';
import { ResolveRefreshTokenError } from './enums/errors/resolve-refresh-token.enum';
import { CaptchaService } from '@models/captcha/captcha.service';
import { ValidateAnswerError } from '@models/captcha/enums/errors/validate-answer.enum';
import { LoginResponseDTO } from './dto/login-response.dto';
import { RegisterResponseDTO } from './dto/register-response.dto';
import { AuthUserResponseDTO } from './dto/auth-user-response.dto';
import { AuthUser } from './interfaces/auth-user.interface';
import { GetAuthUser } from '@common/decorators/get-auth-user.decorator';
import { GetUserExtraError } from './enums/errors/get-user-extra.enum';
import { AuthUserException } from './constants/exceptions/auth-user.exception';
import { GetClientIP } from '@common/decorators/get-client-ip.decorator';
import { GetClientUserAgent } from '@common/decorators/get-client-user-agent.decorator';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly captchaService: CaptchaService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Log in as a user' })
  @ApiBasicAuth()
  @ApiResponse({
    status: 200,
    type: LoginResponseDTO,
    description: 'Access tokens data',
  })
  async login(
    @Body() { email, password }: LoginRequestDTO,
    @GetClientIP() ip: string,
    @GetClientUserAgent() userAgent: string,
  ): Promise<LoginResponseDTO> {
    const [
      loginStatus,
      loginError,
      loginResponse,
    ] = await this.authService.login(email, password, ip, userAgent);

    if (!loginStatus) {
      switch (loginError) {
        case LoginError.FindUserError:
          throw new InternalServerErrorException(LoginException.FindUserError);
        case LoginError.UserNotExists:
          throw new UnauthorizedException(LoginException.UserNotExists);
        case LoginError.InvalidPassword:
          throw new UnauthorizedException(LoginException.InvalidPassword);
        case LoginError.CreateAccessSessionError:
          throw new InternalServerErrorException(
            LoginException.CreateAccessSessionError,
          );
        case LoginError.AccessSessionNotCreated:
          throw new InternalServerErrorException(
            LoginException.AccessSessionNotCreated,
          );
        case LoginError.RefreshSessionNotCreated:
          throw new InternalServerErrorException(
            LoginException.RefreshSessionNotCreated,
          );
        default:
          throw new InternalServerErrorException(
            LoginException.LoginUnknownError,
          );
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
  @ApiOperation({ summary: 'Update a pair of jwt access tokens' })
  @ApiResponse({
    status: 200,
    type: LoginResponseDTO,
    description: 'Access tokens data',
  })
  async refresh(
    @Body() { refresh_token }: RefreshRequestDTO,
    @GetClientIP() ip: string,
    @GetClientUserAgent() userAgent: string,
  ): Promise<LoginResponseDTO> {
    const [
      resolveStatus,
      resolveError,
      resolveResponse,
    ] = await this.tokenService.resolveRefreshToken(refresh_token);

    if (!resolveStatus) {
      switch (resolveError) {
        case DecodeJwtTokenError.TokenExpired:
          throw new UnauthorizedException(RefreshException.RefreshTokenExpired);
        case DecodeJwtTokenError.TokenMalformed:
          throw new UnauthorizedException(
            RefreshException.RefreshTokenMalformed,
          );
        case ResolveRefreshTokenError.ValidateRefreshSessionError:
          throw new UnauthorizedException(
            RefreshException.ValidateRefreshSessionError,
          );
        case ResolveRefreshTokenError.RefreshSessionNotExists:
          throw new UnauthorizedException(
            RefreshException.RefreshSessionNotExists,
          );
        case ResolveRefreshTokenError.RefreshSessionExpired:
          throw new UnauthorizedException(
            RefreshException.RefreshSessionExpired,
          );
        default:
          throw new InternalServerErrorException(
            RefreshException.ResolveRefreshTokenUnknownError,
          );
      }
    }

    const { userId, refreshSecret, email } = resolveResponse;
    const [
      refreshStatus,
      refreshError,
      refreshResponse,
    ] = await this.authService.refresh(userId, refreshSecret, ip, userAgent);

    if (!refreshStatus) {
      switch (refreshError) {
        case RefreshError.DeleteRefreshSessionError:
          throw new InternalServerErrorException(
            RefreshException.DeleteRefreshSessionError,
          );
        case RefreshError.RefreshSessionNotDeleted:
          throw new InternalServerErrorException(
            RefreshException.RefreshSessionNotDeleted,
          );
        case RefreshError.CreateAccessSessionError:
          throw new InternalServerErrorException(
            RefreshException.CreateAccessSessionError,
          );
        case RefreshError.AccessSessionNotCreated:
          throw new InternalServerErrorException(
            RefreshException.AccessSessionNotCreated,
          );
        case RefreshError.RefreshSessionNotCreated:
          throw new InternalServerErrorException(
            RefreshException.RefreshSessionNotCreated,
          );
        default:
          throw new InternalServerErrorException(
            RefreshException.RefreshSessionUnknownError,
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
  @ApiOperation({ summary: 'Log out as a user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Successful logout',
  })
  async logout(@GetAuthUser() user: AuthUser): Promise<void> {
    const userId = user.id;

    const [logoutStatus, logoutError] = await this.authService.logout(userId);

    if (!logoutStatus) {
      switch (logoutError) {
        case LogoutError.DeleteAllUserSessionsError:
          throw new InternalServerErrorException(
            LogoutException.DeleteAllUserSessionsError,
          );
        case LogoutError.SessionsNotDeleted:
          throw new InternalServerErrorException(
            LogoutException.SessionsNotDeleted,
          );
        default:
          throw new InternalServerErrorException(
            LogoutException.UnknownLogoutError,
          );
      }
    }
  }

  @UseGuards(GuestGuard)
  @Post('/register')
  @HttpCode(200)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 200,
    type: RegisterResponseDTO,
    description: 'Registered user data',
  })
  async register(
    @Body()
    {
      captcha_token: captchaToken,
      captcha_answer: captchaAnswer,
      display_name: displayName,
      email,
      password,
    }: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO> {
    const [
      validateStatus,
      validateErrorType,
      isAnswerCorrect,
    ] = await this.captchaService.validateAnswer(captchaToken, captchaAnswer);

    if (!validateStatus) {
      switch (validateErrorType) {
        case DecodeJwtTokenError.TokenExpired:
          throw new ForbiddenException(RegisterException.CaptchaTokenExpired);
        case DecodeJwtTokenError.TokenMalformed:
          throw new ForbiddenException(RegisterException.CaptchaTokenMalformed);
        case ValidateAnswerError.ValidateTaskError:
          throw new InternalServerErrorException(
            RegisterException.CaptchaValidateTaskError,
          );
        case ValidateAnswerError.TaskNotFound:
          throw new ForbiddenException(RegisterException.CaptchaTaskNotFound);
        default:
          throw new InternalServerErrorException(
            RegisterException.CaptchaUnknownError,
          );
      }
    } else if (!isAnswerCorrect) {
      throw new ForbiddenException(RegisterException.WrongCaptchaAnswer);
    }

    const [
      registerStatus,
      registerError,
      registerResponse,
    ] = await this.authService.register(displayName, email, password);

    if (!registerStatus) {
      switch (registerError) {
        case RegisterError.CreateUserError:
          throw new InternalServerErrorException(
            RegisterException.CreateUserError,
          );
        case RegisterError.UserNotCreated:
          throw new InternalServerErrorException(
            RegisterException.UserNotCreated,
          );
        case RegisterError.UserAlreadyExists:
          throw new ForbiddenException(RegisterException.UserAlreadyExists);
        case RegisterError.SentNotifyMailError:
          throw new InternalServerErrorException(
            RegisterException.SentNotifyMailError,
          );
        default:
          throw new InternalServerErrorException(
            RegisterException.CreateUserUnknownError,
          );
      }
    }

    const { userId } = registerResponse;

    return {
      user_id: userId,
      email,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  @ApiOperation({ summary: 'Get data of an authorized user' })
  @ApiResponse({
    status: 200,
    type: AuthUserResponseDTO,
    description: 'Authorized user data',
  })
  @ApiBearerAuth()
  async getUser(@GetAuthUser() user: AuthUser): Promise<AuthUserResponseDTO> {
    const [
      userExtraStatus,
      userExtraError,
      userExtraResponse,
    ] = await this.authService.getUserExtra(user);

    if (!userExtraStatus) {
      switch (userExtraError) {
        case GetUserExtraError.FindAvatarError:
          throw new InternalServerErrorException(
            AuthUserException.FindAvatarError,
          );
        default:
          throw new InternalServerErrorException(
            AuthUserException.UnknownError,
          );
      }
    }

    const { id, email, role, displayName, avatar } = userExtraResponse;

    return {
      id,
      email,
      role,
      display_name: displayName,
      avatar: avatar
        ? {
            id: avatar.id,
            url: avatar.url,
          }
        : null,
    };
  }
}

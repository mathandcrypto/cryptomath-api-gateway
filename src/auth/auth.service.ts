import { Injectable } from '@nestjs/common';
import { UserPackageService } from '@providers/grpc/user/user-package.service';
import { AuthPackageService } from '@providers/grpc/auth/auth-package.service';
import { MailerService } from '@providers/rmq/mailer/mailer.service';
import { LoginError } from './enums/login-error.enum';
import { LogoutError } from './enums/logout-error.enum';
import { RefreshError } from './enums/refresh-error.enum';
import { RegisterError } from './enums/register-error.enum';
import { LoginResponse } from './interfaces/login-response.interface';
import { RefreshResponse } from './interfaces/refresh-response.interface';
import { RegisterResponse } from './interfaces/register-response.interface';
import { AuthUser } from './interfaces/auth-user.interface';
import { AuthUserExtra } from './interfaces/auth-user-extra.interface';
import { GetUserExtraError } from './enums/get-user-extra-error.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userPackageService: UserPackageService,
    private readonly authPackageService: AuthPackageService,
    private readonly mailerService: MailerService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<[boolean, LoginError, LoginResponse]> {
    const [
      validateStatus,
      validateResponse,
    ] = await this.userPackageService.findByEmailAndPassword(email, password);

    if (!validateStatus) {
      return [false, LoginError.FindUserError, null];
    }

    const { isUserExists, isValidPassword, user } = validateResponse;

    if (!isUserExists) {
      return [false, LoginError.UserNotExists, null];
    } else if (!isValidPassword) {
      return [false, LoginError.InvalidPassword, null];
    }

    const { id: userId } = user;

    const [
      createSessionStatus,
      createSessionResponse,
    ] = await this.authPackageService.createAccessSession(userId);

    if (!createSessionStatus) {
      return [false, LoginError.CreateAccessSessionError, null];
    }

    const {
      isAccessSessionCreated,
      isRefreshSessionCreated,
      accessSecret,
      refreshSecret,
    } = createSessionResponse;

    if (!isAccessSessionCreated) {
      return [false, LoginError.AccessSessionNotCreated, null];
    } else if (!isRefreshSessionCreated) {
      return [false, LoginError.RefreshSessionNotCreated, null];
    }

    return [true, null, { userId, email, accessSecret, refreshSecret }];
  }

  async logout(userId: number): Promise<[boolean, LogoutError]> {
    const [
      deleteSessionsStatus,
      deleteSessionsResponse,
    ] = await this.authPackageService.deleteAllUserSessions(userId);

    if (!deleteSessionsStatus) {
      return [false, LogoutError.DeleteAllUserSessionsError];
    }

    const { isSessionsDeleted } = deleteSessionsResponse;

    if (!isSessionsDeleted) {
      return [false, LogoutError.SessionsNotDeleted];
    }

    return [true, null];
  }

  async refresh(
    userId: number,
    refreshSecret: string,
  ): Promise<[boolean, RefreshError, RefreshResponse]> {
    const [
      deleteSessionStatus,
      deleteSessionResponse,
    ] = await this.authPackageService.deleteRefreshSession(
      userId,
      refreshSecret,
    );

    if (!deleteSessionStatus) {
      return [false, RefreshError.DeleteRefreshSessionError, null];
    }

    const { isSessionDeleted } = deleteSessionResponse;

    if (!isSessionDeleted) {
      return [false, RefreshError.RefreshSessionNotDeleted, null];
    }

    const [
      createSessionStatus,
      createSessionResponse,
    ] = await this.authPackageService.createAccessSession(userId);

    if (!createSessionStatus) {
      return [false, RefreshError.CreateAccessSessionError, null];
    }

    const {
      isAccessSessionCreated,
      isRefreshSessionCreated,
      accessSecret,
      refreshSecret: newRefreshSecret,
    } = createSessionResponse;

    if (!isAccessSessionCreated) {
      return [false, RefreshError.AccessSessionNotCreated, null];
    } else if (!isRefreshSessionCreated) {
      return [false, RefreshError.RefreshSessionNotCreated, null];
    }

    return [true, null, { accessSecret, refreshSecret: newRefreshSecret }];
  }

  async register(
    displayName: string,
    email: string,
    password: string,
  ): Promise<[boolean, RegisterError, RegisterResponse]> {
    const [
      createStatus,
      createResponse,
    ] = await this.userPackageService.createUser(displayName, email, password);

    if (!createStatus) {
      return [false, RegisterError.CreateUserError, null];
    }

    const { isUserCreated, isUserAlreadyExists, createdUser } = createResponse;

    if (isUserAlreadyExists) {
      return [false, RegisterError.UserAlreadyExists, null];
    } else if (!isUserCreated) {
      return [false, RegisterError.UserNotCreated, null];
    }

    const { id, confirmCode } = createdUser;

    const [sendMailStatus] = this.mailerService.sendRegisterNotify(
      id,
      email,
      displayName,
      confirmCode,
    );

    if (!sendMailStatus) {
      return [false, RegisterError.SentNotifyMailError, null];
    }

    return [true, null, { userId: id }];
  }

  async getUserExtra(
    user: AuthUser,
  ): Promise<[boolean, GetUserExtraError, AuthUserExtra]> {
    const [
      findAvatarStatus,
      findAvatarResponse,
    ] = await this.userPackageService.findAvatar(user.id);

    if (!findAvatarStatus) {
      return [false, GetUserExtraError.FindAvatarError, null];
    }

    const { isAvatarExists, avatar } = findAvatarResponse;

    return [true, null, { ...user, avatar: isAvatarExists ? avatar : null }];
  }
}

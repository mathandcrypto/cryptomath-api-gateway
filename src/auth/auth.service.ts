import { Injectable } from '@nestjs/common';
import { UserPackageMethodsService } from '@providers/grpc/user/user-package-methods.service';
import { AuthPackageMethodsService } from '@providers/grpc/auth/auth-package-methods.service';
import { LoginErrorType } from './enums/login-error-type.enum';
import { LogoutErrorType } from './enums/logout-error-type.enum';
import { RefreshErrorType } from './enums/refresh-error-type.enum';
import { LoginResponse } from './interfaces/login-response.interface';
import { RefreshResponse } from './interfaces/refresh-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userPackageMethodsService: UserPackageMethodsService,
    private readonly authPackageMethodsService: AuthPackageMethodsService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<[boolean, LoginErrorType, LoginResponse]> {
    const [
      validateStatus,
      validateResponse,
    ] = await this.userPackageMethodsService.findByEmailAndPassword(
      email,
      password,
    );

    if (!validateStatus) {
      return [false, LoginErrorType.FindUserError, null];
    }

    const { isUserExists, isValidPassword, user } = validateResponse;

    if (!isUserExists) {
      return [false, LoginErrorType.UserNotExists, null];
    } else if (!isValidPassword) {
      return [false, LoginErrorType.InvalidPassword, null];
    }

    const { id: userId } = user;

    const [
      createSessionStatus,
      createSessionResponse,
    ] = await this.authPackageMethodsService.createAccessSession(userId);

    if (!createSessionStatus) {
      return [false, LoginErrorType.CreateAccessSessionError, null];
    }

    const {
      isAccessSessionCreated,
      isRefreshSessionCreated,
      accessSecret,
      refreshSecret,
    } = createSessionResponse;

    if (!isAccessSessionCreated) {
      return [false, LoginErrorType.AccessSessionNotCreated, null];
    } else if (!isRefreshSessionCreated) {
      return [false, LoginErrorType.RefreshSessionNotCreated, null];
    }

    return [true, null, { userId, email, accessSecret, refreshSecret }];
  }

  async logout(userId: number): Promise<[boolean, LogoutErrorType]> {
    const [
      deleteSessionsStatus,
      deleteSessionsResponse,
    ] = await this.authPackageMethodsService.deleteAllUserSessions(userId);

    if (!deleteSessionsStatus) {
      return [false, LogoutErrorType.DeleteAllUserSessionsError];
    }

    const { isSessionsDeleted } = deleteSessionsResponse;

    if (!isSessionsDeleted) {
      return [false, LogoutErrorType.SessionsNotDeleted];
    }

    return [true, null];
  }

  async refresh(
    userId: number,
    refreshSecret: string,
  ): Promise<[boolean, RefreshErrorType, RefreshResponse]> {
    const [
      deleteSessionStatus,
      deleteSessionResponse,
    ] = await this.authPackageMethodsService.deleteRefreshSession(
      userId,
      refreshSecret,
    );

    if (!deleteSessionStatus) {
      return [false, RefreshErrorType.DeleteRefreshSessionError, null];
    }

    const { isSessionDeleted } = deleteSessionResponse;

    if (!isSessionDeleted) {
      return [false, RefreshErrorType.RefreshSessionNotDeleted, null];
    }

    const [
      createSessionStatus,
      createSessionResponse,
    ] = await this.authPackageMethodsService.createAccessSession(userId);

    if (!createSessionStatus) {
      return [false, RefreshErrorType.CreateAccessSessionError, null];
    }

    const {
      isAccessSessionCreated,
      isRefreshSessionCreated,
      accessSecret,
      refreshSecret: newRefreshSecret,
    } = createSessionResponse;

    if (!isAccessSessionCreated) {
      return [false, RefreshErrorType.AccessSessionNotCreated, null];
    } else if (!isRefreshSessionCreated) {
      return [false, RefreshErrorType.RefreshSessionNotCreated, null];
    }

    return [true, null, { accessSecret, refreshSecret: newRefreshSecret }];
  }
}

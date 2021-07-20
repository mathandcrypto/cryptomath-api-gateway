import { Injectable } from '@nestjs/common';
import { UserPackageService } from '@providers/grpc/user/user-package.service';
import { AuthPackageService } from '@providers/grpc/auth/auth-package.service';
import { MailerService } from '@providers/rmq/mailer/mailer.service';
import { LoginError } from './enums/errors/login.enum';
import { LogoutError } from './enums/errors/logout.enum';
import { RefreshError } from './enums/errors/refresh.enum';
import { RegisterError } from './enums/errors/register.enum';
import { AuthLogin } from './interfaces/login.interface';
import { AuthRefresh } from './interfaces/refresh.interface';
import { AuthRegister } from './interfaces/register.interface';

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
    ip: string,
    userAgent: string,
  ): Promise<[boolean, LoginError, AuthLogin]> {
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
    ] = await this.authPackageService.createAccessSession(
      userId,
      ip,
      userAgent,
    );

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
    ip: string,
    userAgent: string,
  ): Promise<[boolean, RefreshError, AuthRefresh]> {
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
    ] = await this.authPackageService.createAccessSession(
      userId,
      ip,
      userAgent,
    );

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
  ): Promise<[boolean, RegisterError, AuthRegister]> {
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

    this.mailerService.sendRegisterNotify(id, email, displayName, confirmCode);

    return [true, null, { userId: id }];
  }
}

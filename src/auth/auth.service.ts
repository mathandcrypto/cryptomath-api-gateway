import { Injectable, Logger } from '@nestjs/common';
import { UserPackageService } from '@providers/grpc/user/user-package.service';
import { AuthPackageService } from '@providers/grpc/auth/auth-package.service';
import { FindByEmailAndPasswordResponse } from 'cryptomath-api-proto/proto/build/user';
import { ValidateAuthSessionResponse } from 'cryptomath-api-proto/proto/build/auth';
import { LoginResponse } from './interfaces/login-response.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userPackageService: UserPackageService,
    private readonly authPackageService: AuthPackageService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<[boolean, FindByEmailAndPasswordResponse]> {
    try {
      const response = await this.userPackageService.client
        .findByEmailAndPassword({
          email,
          password,
        })
        .toPromise();

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async validateAuthSession(
    userId: number,
    accessSecret: string,
  ): Promise<[boolean, ValidateAuthSessionResponse]> {
    try {
      const response = await this.authPackageService.client
        .validateAuthSession({
          userId,
          accessSecret,
        })
        .toPromise();

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<[boolean, string, LoginResponse]> {
    const [
      validateStatus,
      { isUserExists, isValidPassword, user },
    ] = await this.validateUser(email, password);

    if (!validateStatus) {
      return [false, 'user_request_error', null];
    } else if (!isUserExists) {
      return [false, 'user_not_exists', null];
    } else if (!isValidPassword) {
      return [false, 'invalid_password', null];
    }

    const { id: userId } = user;

    try {
      const {
        isSessionCreated,
        accessSecret,
        refreshSecret,
      } = await this.authPackageService.client
        .createAuthSession({ userId })
        .toPromise();

      if (!isSessionCreated) {
        return [false, 'auth_session_not_created', null];
      }

      return [true, '', { userId, email, accessSecret, refreshSecret }];
    } catch (error) {
      this.logger.error(error);

      return [false, 'auth_request_error', null];
    }
  }
}

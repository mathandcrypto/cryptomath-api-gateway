import { Injectable, Logger } from '@nestjs/common';
import { AuthPackageService } from './auth-package.service';
import {
  CreateAccessSessionResponse,
  ValidateAccessSessionResponse,
  ValidateRefreshSessionResponse,
  DeleteRefreshSessionResponse,
  DeleteAllUserSessionsResponse,
} from 'cryptomath-api-proto/proto/build/auth';

@Injectable()
export class AuthPackageMethodsService {
  private readonly logger = new Logger(AuthPackageMethodsService.name);

  constructor(private readonly authPackageService: AuthPackageService) {}

  async createAccessSession(
    userId: number,
  ): Promise<[boolean, CreateAccessSessionResponse]> {
    try {
      const response = await this.authPackageService.client
        .createAccessSession({ userId })
        .toPromise();

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async validateAccessSession(
    userId: number,
    accessSecret: string,
  ): Promise<[boolean, ValidateAccessSessionResponse]> {
    try {
      const response = await this.authPackageService.client
        .validateAccessSession({
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

  async validateRefreshSession(
    userId: number,
    refreshSecret: string,
  ): Promise<[boolean, ValidateRefreshSessionResponse]> {
    try {
      const response = await this.authPackageService.client
        .validateRefreshSession({ userId, refreshSecret })
        .toPromise();

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async deleteRefreshSession(
    userId: number,
    refreshSecret: string,
  ): Promise<[boolean, DeleteRefreshSessionResponse]> {
    try {
      const response = await this.authPackageService.client
        .deleteRefreshSession({ userId, refreshSecret })
        .toPromise();

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async deleteAllUserSessions(
    userId: number,
  ): Promise<[boolean, DeleteAllUserSessionsResponse]> {
    try {
      const response = await this.authPackageService.client
        .deleteAllUserSessions({ userId })
        .toPromise();

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }
}

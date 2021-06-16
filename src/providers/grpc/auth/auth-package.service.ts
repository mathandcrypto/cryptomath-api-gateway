import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  CreateAccessSessionResponse,
  DeleteAllUserSessionsResponse,
  DeleteRefreshSessionResponse,
  ValidateAccessSessionResponse,
  ValidateRefreshSessionResponse,
} from 'cryptomath-api-proto/types/auth';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthPackageService implements OnModuleInit {
  private readonly logger = new Logger(AuthPackageService.name);
  private client: AuthServiceClient;

  constructor(@Inject(AUTH_PACKAGE_NAME) private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.client = this.clientGrpc.getService<AuthServiceClient>(
      AUTH_SERVICE_NAME,
    );
  }

  async createAccessSession(
    userId: number,
    ip: string,
    userAgent: string
  ): Promise<[boolean, CreateAccessSessionResponse]> {
    try {
      const response = await this.client
        .createAccessSession({ userId, ip, userAgent })
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
      const response = await this.client
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
      const response = await this.client
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
      const response = await this.client
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
      const response = await this.client
        .deleteAllUserSessions({ userId })
        .toPromise();

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }
}

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
} from '@cryptomath/cryptomath-api-proto/types/auth';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthPackageService implements OnModuleInit {
  private readonly logger = new Logger(AuthPackageService.name);
  private client: AuthServiceClient;

  constructor(@Inject(AUTH_PACKAGE_NAME) private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.client =
      this.clientGrpc.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async createAccessSession(
    userId: number,
    ip: string,
    userAgent: string,
  ): Promise<[boolean, CreateAccessSessionResponse]> {
    try {
      const observable = this.client.createAccessSession({
        userId,
        ip,
        userAgent,
      });
      const response = await firstValueFrom<CreateAccessSessionResponse>(
        observable,
      );

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
      const observable = this.client.validateAccessSession({
        userId,
        accessSecret,
      });
      const response = await firstValueFrom<ValidateAccessSessionResponse>(
        observable,
      );

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
      const observable = this.client.validateRefreshSession({
        userId,
        refreshSecret,
      });
      const response = await firstValueFrom<ValidateRefreshSessionResponse>(
        observable,
      );

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
      const observable = this.client.deleteRefreshSession({
        userId,
        refreshSecret,
      });
      const response = await firstValueFrom<DeleteRefreshSessionResponse>(
        observable,
      );

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
      const observable = this.client.deleteAllUserSessions({ userId });
      const response = await firstValueFrom<DeleteAllUserSessionsResponse>(
        observable,
      );

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }
}

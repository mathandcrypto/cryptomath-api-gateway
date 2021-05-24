import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  CreateUserResponse,
  FindByEmailAndPasswordResponse,
  FindOneResponse,
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'cryptomath-api-proto/types/user';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class UserPackageService implements OnModuleInit {
  private readonly logger = new Logger(UserPackageService.name);
  private client: UserServiceClient;

  constructor(@Inject(USER_PACKAGE_NAME) private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.client = this.clientGrpc.getService<UserServiceClient>(
      USER_SERVICE_NAME,
    );
  }

  async createUser(
    displayName,
    email,
    password,
  ): Promise<[boolean, CreateUserResponse]> {
    try {
      const response = await this.client
        .createUser({
          displayName,
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

  async findOne(id: number): Promise<[boolean, FindOneResponse]> {
    try {
      const response = await this.client
        .findOne({
          id,
        })
        .toPromise();

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<[boolean, FindByEmailAndPasswordResponse]> {
    try {
      const response = await this.client
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
}

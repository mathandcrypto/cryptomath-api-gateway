import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  CreateUserResponse,
  FindByEmailAndPasswordResponse,
  FindOneResponse,
  FindFromListResponse,
  FindAvatarResponse,
  DeleteAvatarResponse,
  CreateAvatarResponse,
  FindProfileResponse,
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '@cryptomath/cryptomath-api-proto/types/user';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserPackageService implements OnModuleInit {
  private readonly logger = new Logger(UserPackageService.name);
  private client: UserServiceClient;

  constructor(@Inject(USER_PACKAGE_NAME) private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.client =
      this.clientGrpc.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async createUser(
    displayName,
    email,
    password,
  ): Promise<[boolean, CreateUserResponse]> {
    try {
      const observable = this.client.createUser({
        displayName,
        email,
        password,
      });
      const response = await firstValueFrom<CreateUserResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async findOne(id: number): Promise<[boolean, FindOneResponse]> {
    try {
      const observable = this.client.findOne({
        id,
      });
      const response = await firstValueFrom<FindOneResponse>(observable);

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
      const observable = this.client.findByEmailAndPassword({
        email,
        password,
      });
      const response = await firstValueFrom<FindByEmailAndPasswordResponse>(
        observable,
      );

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async findFromList(
    idList: number[],
  ): Promise<[boolean, FindFromListResponse]> {
    try {
      const observable = this.client.findFromList({ idList });
      const response = await firstValueFrom<FindFromListResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async findAvatar(userId: number): Promise<[boolean, FindAvatarResponse]> {
    try {
      const observable = this.client.findAvatar({ userId });
      const response = await firstValueFrom<FindAvatarResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async deleteAvatar(
    userId: number,
    avatarId: number,
  ): Promise<[boolean, DeleteAvatarResponse]> {
    try {
      const observable = this.client.deleteAvatar({ userId, avatarId });
      const response = await firstValueFrom<DeleteAvatarResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async createAvatar(
    userId: number,
    key: string,
    url: string,
  ): Promise<[boolean, CreateAvatarResponse]> {
    try {
      const observable = this.client.createAvatar({ userId, key, url });
      const response = await firstValueFrom<CreateAvatarResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }

  async findProfile(userId: number): Promise<[boolean, FindProfileResponse]> {
    try {
      const observable = this.client.findProfile({ userId });
      const response = await firstValueFrom<FindProfileResponse>(observable);

      return [true, response];
    } catch (error) {
      this.logger.error(error);

      return [false, null];
    }
  }
}

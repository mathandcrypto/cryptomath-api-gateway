import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient,
} from 'cryptomath-api-proto/proto/build/user';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class UserPackageService implements OnModuleInit {
  client: UserServiceClient;

  constructor(@Inject(USER_PACKAGE_NAME) private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.client = this.clientGrpc.getService<UserServiceClient>(
      USER_SERVICE_NAME,
    );
  }
}

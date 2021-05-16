import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
} from 'cryptomath-api-proto/proto/build/auth';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AuthPackageService implements OnModuleInit {
  client: AuthServiceClient;

  constructor(@Inject(AUTH_PACKAGE_NAME) private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.client = this.clientGrpc.getService<AuthServiceClient>(
      AUTH_SERVICE_NAME,
    );
  }
}

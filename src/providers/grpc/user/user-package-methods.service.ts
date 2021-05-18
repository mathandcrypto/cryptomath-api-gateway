import { Injectable, Logger } from '@nestjs/common';
import { UserPackageService } from './user-package.service';
import {
  FindByEmailAndPasswordResponse,
  FindOneResponse,
} from 'cryptomath-api-proto/proto/build/user';

@Injectable()
export class UserPackageMethodsService {
  private readonly logger = new Logger(UserPackageMethodsService.name);

  constructor(private readonly userPackageService: UserPackageService) {}

  async findOne(id: number): Promise<[boolean, FindOneResponse]> {
    try {
      const response = await this.userPackageService.client
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
}

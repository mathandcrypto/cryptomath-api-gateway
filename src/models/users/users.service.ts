import { Injectable, Logger } from '@nestjs/common';
import { UserPackageService } from '@providers/grpc/user/user-package.service';
import { FindOneResponse } from 'cryptomath-api-proto/proto/build/user';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

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
}

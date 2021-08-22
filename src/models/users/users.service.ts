import { Injectable } from '@nestjs/common';
import { UserPackageService } from '@providers/grpc/user/user-package.service';

@Injectable()
export class UsersService {
  constructor(private readonly userPackageService: UserPackageService) {}
}

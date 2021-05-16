import { Controller, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  @Get('check')
  check() {
    return 'private access';
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(
    userId: number,
    email: string,
    accessSecret: string,
  ) {
    const payload: JwtPayload = { id: userId, secret: accessSecret };

    return this.jwtService.signAsync(payload, {
      subject: email,
    });
  }

  async generateRefreshToken(
    userId: number,
    email: string,
    refreshSecret: string,
  ) {
    const payload: JwtPayload = { id: userId, secret: refreshSecret };

    return this.jwtService.signAsync(payload, {
      expiresIn: '15d',
      subject: email,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '@config/jwt/config.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { TokenExpiredError } from 'jsonwebtoken';
import { AuthPackageService } from '@providers/grpc/auth/auth-package.service';
import { AuthResolveRefreshToken } from './interfaces/resolve-refresh-token.interface';
import { ResolveRefreshTokenError } from './enums/errors/resolve-refresh-token.enum';
import { DecodeJwtTokenError } from '@common/enums/errors/decode-jwt-token.enum';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    private readonly authPackageService: AuthPackageService,
  ) {}

  async generateAccessToken(
    userId: number,
    email: string,
    accessSecret: string,
  ): Promise<string> {
    const payload: JwtPayload = { id: userId, secret: accessSecret };

    return this.jwtService.signAsync(payload, {
      subject: email,
    });
  }

  async generateRefreshToken(
    userId: number,
    email: string,
    refreshSecret: string,
  ): Promise<string> {
    const payload: JwtPayload = { id: userId, secret: refreshSecret };

    return this.jwtService.signAsync(payload, {
      expiresIn: this.jwtConfigService.refreshTokenExpirationTime,
      secret: this.jwtConfigService.refreshTokenSecret,
      subject: email,
    });
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<[boolean, DecodeJwtTokenError, JwtPayload & { sub: string }]> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfigService.refreshTokenSecret,
      });

      return [true, null, payload];
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return [false, DecodeJwtTokenError.TokenExpired, null];
      } else {
        return [false, DecodeJwtTokenError.TokenMalformed, null];
      }
    }
  }

  async resolveRefreshToken(
    token: string,
  ): Promise<
    [
      boolean,
      DecodeJwtTokenError | ResolveRefreshTokenError,
      AuthResolveRefreshToken,
    ]
  > {
    const [decodeStatus, errorType, payload] = await this.decodeRefreshToken(
      token,
    );

    if (!decodeStatus) {
      return [false, errorType, null];
    }

    const { id: userId, secret: refreshSecret, sub } = payload;

    const [validateStatus, validateResponse] =
      await this.authPackageService.validateRefreshSession(
        userId,
        refreshSecret,
      );

    if (!validateStatus) {
      return [
        false,
        ResolveRefreshTokenError.ValidateRefreshSessionError,
        null,
      ];
    }

    const { isSessionExists, isSessionExpired } = validateResponse;

    if (!isSessionExists) {
      return [false, ResolveRefreshTokenError.RefreshSessionNotExists, null];
    } else if (isSessionExpired) {
      return [false, ResolveRefreshTokenError.RefreshSessionExpired, null];
    }

    return [true, null, { userId, refreshSecret, email: sub }];
  }
}

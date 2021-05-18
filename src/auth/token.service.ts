import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '@config/jwt/config.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { TokenExpiredError } from 'jsonwebtoken';
import { AuthPackageMethodsService } from '@providers/grpc/auth/auth-package-methods.service';
import { ResolveRefreshTokenResponse } from './interfaces/resolve-refresh-token-response.interface';
import { DecodeRefreshTokenErrorType } from './enums/decode-refresh-token-error-type.enum';
import { ResolveRefreshTokenErrorType } from './enums/resolve-refresh-token-error-type.enum';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    private readonly authPackageMethodsService: AuthPackageMethodsService,
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
  ): Promise<
    [boolean, DecodeRefreshTokenErrorType, JwtPayload & { sub: string }]
  > {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfigService.refreshTokenSecret,
      });

      return [true, null, payload];
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return [false, DecodeRefreshTokenErrorType.TokenExpired, null];
      } else {
        return [false, DecodeRefreshTokenErrorType.TokenMalformed, null];
      }
    }
  }

  async resolveRefreshToken(
    token: string,
  ): Promise<
    [
      boolean,
      DecodeRefreshTokenErrorType | ResolveRefreshTokenErrorType,
      ResolveRefreshTokenResponse,
    ]
  > {
    const [decodeStatus, errorType, payload] = await this.decodeRefreshToken(
      token,
    );

    if (!decodeStatus) {
      return [false, errorType, null];
    }

    const { id: userId, secret: refreshSecret, sub } = payload;

    const [
      validateStatus,
      validateResponse,
    ] = await this.authPackageMethodsService.validateRefreshSession(
      userId,
      refreshSecret,
    );

    if (!validateStatus) {
      return [
        false,
        ResolveRefreshTokenErrorType.ValidateRefreshSessionError,
        null,
      ];
    }

    const { isSessionExists, isSessionExpired } = validateResponse;

    if (!isSessionExists) {
      return [
        false,
        ResolveRefreshTokenErrorType.RefreshSessionNotExists,
        null,
      ];
    } else if (isSessionExpired) {
      return [false, ResolveRefreshTokenErrorType.RefreshSessionExpired, null];
    }

    return [true, null, { userId, refreshSecret, email: sub }];
  }
}

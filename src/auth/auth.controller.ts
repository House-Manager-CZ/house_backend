import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Request, Response } from 'express';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import UserEntity from '../entities/user.entity';
import { JwtRefreshAuthGuard } from '../common/guards/jwt-refresh-auth.guard';
import SentryInterceptor from '../common/interceptors/sentry.interceptor';
import { jwtConstants } from './consts';
import parse from 'parse-duration';

@UseInterceptors(SentryInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  private async login(@Req() request: Request, @Res() response: Response) {
    const accessCookie = this.authService.generateAccessTokenCookie(
      request.user,
    );
    const refreshCookie = this.authService.generateRefreshTokenCookie(
      request.user,
    );

    await this.usersService.setRefreshToken(
      (request.user as UserEntity).id,
      refreshCookie.token,
    );

    response.setHeader('Set-Cookie', [
      accessCookie.cookie,
      refreshCookie.cookie,
    ]);

    return response.send({
      accessToken: accessCookie.token,
      refreshToken: refreshCookie.token,
      expiresIn: parse(jwtConstants.tokenExpiresIn),
    });
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async refresh(@Req() request: Request, @Res() response: Response) {
    const accessToken = this.authService.generateAccessTokenCookie(
      request.user,
    );

    const refreshToken = this.authService.generateRefreshTokenCookie(
      request.user,
    );

    await this.usersService.setRefreshToken(
      (request.user as UserEntity).id,
      refreshToken.token,
    );

    response.setHeader('Set-Cookie', [accessToken.cookie, refreshToken.cookie]);
    return response.send({
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      expiresIn: parse(jwtConstants.tokenExpiresIn),
    });
  }
}

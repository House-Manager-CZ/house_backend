import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Request, Response } from 'express';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import UserEntity from '../entities/user.entity';
import { instanceToPlain } from 'class-transformer';

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

    response.setHeader('Set-Cookie', [accessCookie, refreshCookie.cookie]);

    return response.send(instanceToPlain(request.user));
  }
}

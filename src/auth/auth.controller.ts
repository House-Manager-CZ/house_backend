import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Request, Response } from 'express';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import UserEntity, { USER_ENTITY_KEYS } from '../entities/user.entity';
import { JwtRefreshAuthGuard } from '../common/guards/jwt-refresh-auth.guard';
import SentryInterceptor from '../common/interceptors/sentry.interceptor';
import { jwtConstants } from './consts';
import parse from 'parse-duration';
import { RegisterDto } from './auth-dto';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@UseInterceptors(SentryInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Success',
    type: 'object',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  private async login(@Req() request: Request, @Res() response: Response) {
    const accessCookie = this.authService.generateAccessTokenCookie(
      request.user,
    );
    const refreshCookie = this.authService.generateRefreshTokenCookie(
      request.user,
    );

    await this.usersService.setRefreshToken(
      (request.user as UserEntity)[USER_ENTITY_KEYS.ID],
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
  @ApiOkResponse({
    description: 'Success',
    type: 'object',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  public async refresh(@Req() request: Request, @Res() response: Response) {
    const accessToken = this.authService.generateAccessTokenCookie(
      request.user,
    );

    const refreshToken = this.authService.generateRefreshTokenCookie(
      request.user,
    );

    await this.usersService.setRefreshToken(
      (request.user as UserEntity)[USER_ENTITY_KEYS.ID],
      refreshToken.token,
    );

    response.setHeader('Set-Cookie', [accessToken.cookie, refreshToken.cookie]);
    return response.send({
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      expiresIn: parse(jwtConstants.tokenExpiresIn),
    });
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Success',
    type: 'object',
  })
  @ApiConflictResponse({
    description: 'User already exists',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'User registration data',
  })
  public async register(
    @Res() response: Response,
    @Body() registerDto: RegisterDto,
  ) {
    const user = await this.usersService.create(registerDto);

    const accessToken = this.authService.generateAccessTokenCookie(user);

    const refreshToken = this.authService.generateRefreshTokenCookie(user);

    await this.usersService.setRefreshToken(
      user[USER_ENTITY_KEYS.ID],
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

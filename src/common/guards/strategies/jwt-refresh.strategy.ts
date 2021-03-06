import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { jwtConstants } from '../../../auth/consts';
import { UsersService } from '../../../users/users.service';
import { USER_ENTITY_KEYS } from '../../../entities/user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.headers?.refresh;
        },
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: jwtConstants.refreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    const refreshToken = request?.cookies?.Refresh || request?.headers?.refresh;
    const user = this.usersService.findIfRefreshToken(refreshToken, {
      [USER_ENTITY_KEYS.ID]: payload.userId,
    });

    if (!user) return false;

    return user;
  }
}

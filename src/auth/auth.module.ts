import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './consts';
import { LocalStrategy } from '../common/guards/strategies/local.strategy';
import { JwtStrategy } from '../common/guards/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../common/guards/strategies/jwt-refresh.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.tokenSecret,
      signOptions: { expiresIn: jwtConstants.tokenExpiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    SessionSerializer,
  ],
  exports: [PassportModule],
})
export class AuthModule {}

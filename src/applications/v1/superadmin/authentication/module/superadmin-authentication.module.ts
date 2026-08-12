import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/commons/v1/jwt/jwt.strategy';
import { NotifyEngineService } from 'src/commons/v1/notify/notify-engine.service';
import { SuperAdminAuthenticationController } from '../controller/superadmin-authentication.controller';
import { SuperAdminAuthenticationService } from '../service/superadmin-authentication.service';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [SuperAdminAuthenticationController],
  providers: [
    SuperAdminAuthenticationService,
    NotifyEngineService,
    JwtStrategy,
  ],
})
export class SuperAdminAuthenticationModule { }

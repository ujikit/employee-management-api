import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotifyEngineService } from 'src/commons/v1/notify/notify-engine.service';
import { AuthenticationController } from '../controller/authentication.controller';
import { AuthenticationService } from '../service/authentication.service';

@Module({
  imports: [ConfigModule],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    NotifyEngineService,
  ],
})
export class AuthenticationModule { }

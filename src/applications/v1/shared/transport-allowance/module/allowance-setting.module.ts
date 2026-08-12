import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/commons/v1/jwt/jwt.strategy';
import { AllowanceSettingController } from '../controller/allowance-setting.controller';
import { AllowanceSettingService } from '../service/allowance-setting.service';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [AllowanceSettingController],
  providers: [
    AllowanceSettingService,
    JwtStrategy,
  ],
})
export class AllowanceSettingModule { }

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AllowanceDetailController } from './controller/allowance-detail.controller';
import { AllowancePeriodController } from './controller/allowance-period.controller';
import { AllowanceSettingController } from './controller/allowance-setting.controller';
import { AllowanceDetailService } from './service/allowance-detail.service';
import { AllowancePeriodService } from './service/allowance-period.service';
import { AllowanceSettingService } from './service/allowance-setting.service';

@Module({
  imports: [
    ConfigModule
  ],
  controllers: [
    AllowanceSettingController,
    AllowanceDetailController,
    AllowancePeriodController
  ],
  providers: [
    AllowanceSettingService,
    AllowanceDetailService,
    AllowancePeriodService,
  ],
})
export class AllowanceMainModule { }

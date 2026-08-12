import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AllowanceDetailController } from './controller/allowance-detail.controller';
import { AllowancePeriodController } from './controller/allowance-period.controller';
import { AllowanceDetailService } from './service/allowance-detail.service';
import { AllowancePeriodService } from './service/allowance-period.service';

@Module({
  imports: [ConfigModule],
  controllers: [AllowanceDetailController, AllowancePeriodController],
  providers: [
    AllowanceDetailService,
    AllowancePeriodService,
  ],
})
export class AllowanceMainModule { }

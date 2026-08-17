import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AllowancePeriodController } from '../controller/allowance-period.controller';
import { AllowancePeriodService } from '../service/allowance-period.service';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [AllowancePeriodController],
  providers: [
    AllowancePeriodService,
  ],
})
export class AllowancePeriodModule { }

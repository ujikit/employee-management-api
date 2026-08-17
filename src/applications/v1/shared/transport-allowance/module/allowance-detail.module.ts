import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AllowanceDetailController } from '../controller/allowance-detail.controller';
import { AllowanceDetailService } from '../service/allowance-detail.service';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [AllowanceDetailController],
  providers: [
    AllowanceDetailService,
  ],
})
export class AllowanceDetailModule { }

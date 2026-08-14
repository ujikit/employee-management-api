import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../../../../../commons/v1/jwt/jwt.strategy';
import { AllowancePeriodController } from '../controller/allowance-period.controller';
import { AllowancePeriodService } from '../service/allowance-period.service';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [AllowancePeriodController],
  providers: [
    AllowancePeriodService,
    JwtStrategy,
  ],
})
export class AllowancePeriodModule { }

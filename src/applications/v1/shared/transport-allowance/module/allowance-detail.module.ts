import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../../../../../commons/v1/jwt/jwt.strategy';
import { AllowanceDetailController } from '../controller/allowance-detail.controller';
import { AllowanceDetailService } from '../service/allowance-detail.service';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [AllowanceDetailController],
  providers: [
    AllowanceDetailService,
    JwtStrategy,
  ],
})
export class AllowanceDetailModule { }

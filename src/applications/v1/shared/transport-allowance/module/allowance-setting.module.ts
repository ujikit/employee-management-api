import { Module } from '@nestjs/common';
import { DatabaseService } from '../../../../../commons/v1/database/database.service';
import { AllowanceSettingController } from '../controller/allowance-setting.controller';
import { AllowanceSettingService } from '../service/allowance-setting.service';

@Module({
  controllers: [AllowanceSettingController],
  providers: [AllowanceSettingService, DatabaseService],
  exports: [AllowanceSettingService],
})
export class AllowanceSettingModule {}

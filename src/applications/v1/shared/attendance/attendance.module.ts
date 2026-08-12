import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AttendanceController } from './controller/attendance.controller';
import { AttendanceService } from './service/attendance.service';

@Module({
  imports: [ConfigModule],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
  ],
})
export class AllowanceMainModule { }

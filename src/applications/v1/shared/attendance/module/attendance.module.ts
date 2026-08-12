import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/commons/v1/jwt/jwt.strategy';
import { AttendanceController } from '../controller/attendance.controller';
import { AttendanceService } from '../service/attendance.service';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    JwtStrategy,
  ],
})
export class AttendanceModule { }

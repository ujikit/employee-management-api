import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/commons/v1/jwt/jwt.strategy';
import { DatabaseService } from 'src/commons/v1/database/database.service';
import { AttendanceController } from '../controller/attendance.controller';
import { AttendanceService } from '../service/attendance.service';

@Module({
  imports: [ConfigModule],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    DatabaseService,
    JwtStrategy,
  ],
})
export class AttendanceModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from 'src/commons/v1/database/database.service';
import { JwtStrategy } from 'src/commons/v1/jwt/jwt.strategy';
import { EmployeeController } from '../controller/employee.controller';
import { EmployeeService } from '../service/employee.service';

@Module({
  imports: [ConfigModule],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    DatabaseService,
    JwtStrategy,
  ],
})
export class EmployeeModule { }

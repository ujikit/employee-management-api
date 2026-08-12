import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeeController } from './controller/employee.controller';
import { EmployeeService } from './service/employee.service';

@Module({
  imports: [ConfigModule],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
  ],
})
export class AllowanceMainModule { }

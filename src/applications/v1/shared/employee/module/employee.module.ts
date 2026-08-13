import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/commons/v1/database/database.service';
import { EmployeeController } from '../controller/employee.controller';
import { EmployeeService } from '../service/employee.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, DatabaseService],
})
export class EmployeeModule {}

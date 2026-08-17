import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AttendanceModule } from './shared/attendance/module/attendance.module';
import { AuthenticationModule } from './shared/authentication/module/authentication.module';
import { EmployeeModule } from './shared/employee/module/employee.module';
import { RoleModule } from './shared/role/module/role.module';
import { AllowanceMainModule } from './shared/transport-allowance/allowance.module';
import { UsersModule } from './shared/users/module/users.module';

const ROUTES: Routes = [
  {
    path: 'authentication',
    module: AuthenticationModule,
  },
  {
    path: 'allowance',
    module: AllowanceMainModule,
  },
  {
    path: 'employee',
    module: EmployeeModule,
  },
  {
    path: 'attendance',
    module: AttendanceModule,
  },
  {
    path: 'role',
    module: RoleModule,
  },
  {
    path: 'users',
    module: UsersModule,
  },
];

@Module({
  imports: [
    AuthenticationModule,
    AllowanceMainModule,
    EmployeeModule,
    AttendanceModule,
    RoleModule,
    UsersModule,
    RouterModule.register(ROUTES)],
})
export class ApplicationsV1Module { }

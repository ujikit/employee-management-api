import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { AttendanceModule } from './shared/attendance/module/attendance.module';
import { AuthenticationModule } from './shared/authentication/module/authentication.module';
import { EmployeeModule } from './shared/employee/module/employee.module';
import { AllowanceMainModule } from './shared/transport-allowance/allowance.module';

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
  // {
  //   path: 'superadmin',
  //   module: SuperAdminMainModule,
  //   children: [
  //     {
  //       path: 'user',
  //       module: SuperAdminUserModule,
  //     },
  //   ],
  // },
];

@Module({
  imports: [
    AuthenticationModule,
    AllowanceMainModule,
    EmployeeModule,
    AttendanceModule,
    RouterModule.register(ROUTES)],
})
export class ApplicationsV1Module { }

import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { SuperAdminAuthenticationModule } from './superadmin/authentication/module/superadmin-authentication.module';

const ROUTES: Routes = [
  {
    path: 'superadmin',
    module: SuperAdminAuthenticationModule,
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
    SuperAdminAuthenticationModule,
    RouterModule.register(ROUTES)],
})
export class ApplicationsV1Module { }

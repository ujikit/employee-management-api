import { Module } from '@nestjs/common';
import { SuperAdminAuthenticationModule } from './authentication/module/superadmin-authentication.module';

@Module({
  imports: [SuperAdminAuthenticationModule],
})
export class SuperAdminMainModule {}

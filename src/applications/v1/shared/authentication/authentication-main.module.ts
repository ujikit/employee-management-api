import { Module } from '@nestjs/common';
import { AuthenticationModule } from './module/authentication.module';

@Module({
  imports: [AuthenticationModule],
})
export class AuthenticationMainModule { }

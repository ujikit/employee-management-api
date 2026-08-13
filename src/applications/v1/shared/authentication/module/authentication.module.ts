import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/commons/v1/database/database.service';
import { AuthenticationController } from '../controller/authentication.controller';
import { AuthenticationService } from '../service/authentication.service';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService, DatabaseService],
})
export class AuthenticationModule {}

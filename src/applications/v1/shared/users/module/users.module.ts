import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from 'src/commons/v1/database/database.service';
import { UsersController } from '../controller/users.controller';
import { UsersService } from '../service/users.service';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    DatabaseService,
  ],
  exports: [UsersService],
})
export class UsersModule { }

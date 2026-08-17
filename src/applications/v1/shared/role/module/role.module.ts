import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/commons/v1/jwt/jwt.strategy';
import { DatabaseService } from '../../../../../commons/v1/database/database.service';
import { RoleController } from '../controller/role.controller';
import { RoleService } from '../service/role.service';

@Module({
  imports: [ConfigModule],
  controllers: [RoleController],
  providers: [
    RoleService,
    DatabaseService,
    JwtStrategy
  ],
})
export class RoleModule { }

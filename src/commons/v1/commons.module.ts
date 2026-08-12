import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { SharedJwtModule } from './jwt/jwt.module';

@Global()
@Module({
  imports: [DatabaseModule, SharedJwtModule],
  providers: [],
  exports: [
    SharedJwtModule,
  ],
})

export class CommonsV1Module { }

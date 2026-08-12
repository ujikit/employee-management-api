import { Global, Module } from '@nestjs/common';
import { CommonsV1Module } from './v1/commons.module';

@Global()
@Module({
  imports: [CommonsV1Module],
  exports: [CommonsV1Module],
})

export class CommonsModule { }


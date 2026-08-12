import { Module } from '@nestjs/common';
import { ApplicationsV1Module } from './v1/applications.module';

@Module({
  imports: [
    ApplicationsV1Module,
  ],
})
export class ApplicationsModule {}


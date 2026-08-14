import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['error', 'warn'],
      transactionOptions: {
        maxWait: 10_000, // 10s max wait for connection in pool
        timeout: 15_000, // 15s max transaction execution time
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('Prisma connection error during initialization:', error);
      // Don't crash process startup; Prisma will attempt connection on first query
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
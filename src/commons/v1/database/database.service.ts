import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['error', 'warn'],
      // log: [
      //   { level: 'query', emit: 'event' },
      //   { level: 'warn', emit: 'stdout' },
      //   { level: 'error', emit: 'stdout' },
      // ],
      transactionOptions: {
        maxWait: 45_000, // tunggu koneksi
        timeout: 50_000, // durasi transaksi
      },
    });

    // this.$on('query', (e) => {
    //   console.log('SQL:', e.query);
    //   console.log('Params:', e.params);
    // });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

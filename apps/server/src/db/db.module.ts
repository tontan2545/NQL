import { Module, Provider } from '@nestjs/common';
import { PG_CONNECTION } from 'src/constants';
import { Client, types } from 'pg';
import { ConfigService } from '@nestjs/config';
import { DbController } from './db.controller';
import { PrismaService } from 'src/prisma/prisma.service';

const dbProvider: Provider = {
  provide: PG_CONNECTION,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    try {
      const conn = new Client({
        connectionString: configService.get('TARGET_DATABASE_URL'),
      });
      await conn.connect();
      types.setTypeParser(types.builtins.INTERVAL, (val) => val);
      return conn;
    } catch (error) {
      console.log(error);
    }
  },
};

@Module({
  providers: [dbProvider, PrismaService],
  exports: [dbProvider],
  controllers: [DbController],
})
export class DbModule {}

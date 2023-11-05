import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { InferenceModule } from './inference/inference.module';
import { LLMService } from './llm/llm.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    InferenceModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, LLMService],
})
export class AppModule {}

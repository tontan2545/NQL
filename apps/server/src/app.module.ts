import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { InferenceModule } from './inference/inference.module';
import { LLMService } from './llm/llm.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    InferenceModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, LLMService],
})
export class AppModule {}

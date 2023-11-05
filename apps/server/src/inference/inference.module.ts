import { Module } from '@nestjs/common';
import { InferenceService } from './inference.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { InferenceController } from './inference.controller';
import { LLMService } from 'src/llm/llm.service';

@Module({
  providers: [InferenceService, PrismaService, LLMService],
  controllers: [InferenceController],
})
export class InferenceModule {}

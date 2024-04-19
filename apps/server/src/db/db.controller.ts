import { Controller, Get, Inject, Param } from '@nestjs/common';
import { Client } from 'pg';
import { PG_CONNECTION } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('db')
export class DbController {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(PG_CONNECTION) private readonly pgClient: Client,
  ) {}

  @Get('/:inferenceId')
  async getInferenceData(@Param('inferenceId') inferenceId: string) {
    const data = await this.prismaService.inferenceLog.findUnique({
      where: { id: inferenceId },
      select: {
        sql: true,
        prompt: true,
      },
    });

    if (!data) {
      throw new Error('Inference not found');
    }

    return data;
  }

  @Get('/:inferenceId/execute')
  async executeInference(@Param('inferenceId') inferenceId: string) {
    const data = await this.prismaService.inferenceLog.findUnique({
      where: { id: inferenceId },
      select: {
        sql: true,
      },
    });

    if (!data) {
      throw new Error('Inference not found');
    }

    await this.pgClient.connect();

    const queryData = await this.pgClient.query(data.sql);

    await this.pgClient.end();

    return queryData.rows;
  }
}

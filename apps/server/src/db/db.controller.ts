import { Controller, Get, Inject } from '@nestjs/common';
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
  async getLogData(inferenceId: string) {
    const dbData = await this.prismaService.inferenceLog.findUnique({
      where: { id: inferenceId },
      select: {
        prompt: true,
        sql: true,
      },
    });
    return dbData;
  }

  @Get('/:inferenceId/execute')
  async executeInference(inferenceId: string) {
    const { sql } = await this.prismaService.inferenceLog.findUnique({
      where: { id: inferenceId },
      select: {
        sql: true,
      },
    });

    const data = await this.pgClient.query(sql);

    return data.rows;
  }
}

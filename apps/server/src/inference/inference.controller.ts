import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import { RunInferenceDTO } from 'src/inference/inference.dto';
import { InferenceService } from 'src/inference/inference.service';
import { LLMService } from 'src/llm/llm.service';
@Controller('inference')
export class InferenceController {
  constructor(
    private readonly llmService: LLMService,
    private readonly inferenceService: InferenceService,
  ) {}
  @Post('/')
  async runInference(
    @Res() res: Response,
    @Body() runInferenceDTO: RunInferenceDTO,
  ) {
    try {
      const prompt = await this.inferenceService.buildPrompt(
        runInferenceDTO.question,
      );
      const stream = await this.llmService.runInferenceStream(prompt);

      const id = uuid();
      res.set({
        'Content-Type': 'application/octet-stream',
        'Transfer-Encoding': 'chunked',
        'X-Inference-ID': id,
      });

      let sqlResult = 'SELECT';
      res.write(sqlResult);
      for await (const completions of stream) {
        const completionChunk = completions.completion.replaceAll('\n', ' ');
        sqlResult += completionChunk;
        res.write(completionChunk);
      }
      res.end();

      await this.inferenceService.logInference(
        id,
        runInferenceDTO.question,
        sqlResult,
      );
    } catch (e) {
      res.status(500).send({ error: e });
    }
  }
}

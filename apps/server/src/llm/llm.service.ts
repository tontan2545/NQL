import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
@Injectable()
export class LLMService {
  private readonly client: AnthropicBedrock;
  constructor(private readonly configService: ConfigService) {
    this.client = new AnthropicBedrock({
      awsAccessKey: this.configService.get('AWS_ACCESS_KEY_ID'),
      awsSecretKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      awsRegion: 'us-east-1',
    });
  }
  async runInferenceStream(prompt: string) {
    return this.client.completions.create({
      model: 'anthropic.claude-v2',
      stream: true,
      max_tokens_to_sample: 600,
      temperature: 0,
      top_k: 10,
      prompt,
    });
  }
}

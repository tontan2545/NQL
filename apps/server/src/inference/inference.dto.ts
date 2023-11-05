import { IsString } from 'class-validator';

export class RunInferenceDTO {
  @IsString()
  readonly question: string;
}

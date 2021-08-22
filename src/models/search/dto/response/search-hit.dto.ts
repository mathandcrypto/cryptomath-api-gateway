import { IsNumber } from 'class-validator';

export class SearchHitResponseDTO {
  @IsNumber()
  score: number;
}

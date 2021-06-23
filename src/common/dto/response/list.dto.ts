import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListResponseDTO {
  @ApiProperty()
  @IsInt()
  offset: number;

  @ApiProperty()
  @IsInt()
  limit: number;

  @ApiProperty()
  @IsInt()
  total: number;
}

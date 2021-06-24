import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { HubResponseDTO } from './hub.dto';

export class TagResponseDTO {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ type: HubResponseDTO })
  @Type(() => HubResponseDTO)
  @ValidateNested()
  hub: HubResponseDTO;

  @ApiProperty()
  @IsInt()
  articles_count: number;
}

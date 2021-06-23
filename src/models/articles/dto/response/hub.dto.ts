import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HubLogoResponseDTO } from './hub-logo.dto';
import { ApiProperty } from '@nestjs/swagger';

export class HubResponseDTO {
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

  @ApiProperty({ type: HubLogoResponseDTO, required: false })
  @IsOptional()
  @Type(() => HubLogoResponseDTO)
  @ValidateNested()
  logo: HubLogoResponseDTO;

  @ApiProperty()
  @IsInt()
  articles_count: number;

  @ApiProperty()
  @IsInt()
  tags_count: number;
}

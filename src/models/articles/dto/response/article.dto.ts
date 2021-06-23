import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserResponseDTO } from '@models/users/dto/response/user';
import { HubResponseDTO } from './hub.dto';
import { TagResponseDTO } from './tag.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ArticleResponseDTO {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  abstract: string;

  @ApiProperty({ type: UserResponseDTO })
  @Type(() => UserResponseDTO)
  @ValidateNested()
  user: UserResponseDTO;

  @ApiProperty({ type: [HubResponseDTO] })
  @IsArray()
  @Type(() => HubResponseDTO)
  @ValidateNested()
  hubs: HubResponseDTO[];

  @ApiProperty({ type: [TagResponseDTO] })
  @IsArray()
  @Type(() => TagResponseDTO)
  @ValidateNested()
  tags: TagResponseDTO[];

  @ApiProperty()
  @IsInt()
  comments_count: number;

  @ApiProperty()
  @IsInt()
  rating: number;

  @ApiProperty()
  @IsDate()
  created_at: Date;

  @ApiProperty()
  @IsDate()
  updated_at: Date;
}

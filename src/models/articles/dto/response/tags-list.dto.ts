import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ListResponseDTO } from '@common/dto/response/list.dto';
import { TagResponseDTO } from './tag.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TagsListResponseDTO extends ListResponseDTO {
  @ApiProperty({ type: [TagResponseDTO] })
  @IsArray()
  @Type(() => TagResponseDTO)
  tags: TagResponseDTO[];
}

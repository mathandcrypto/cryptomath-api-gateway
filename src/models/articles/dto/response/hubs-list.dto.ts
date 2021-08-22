import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ListResponseDTO } from '@common/dto/response/list.dto';
import { HubResponseDTO } from './hub.dto';
import { ApiProperty } from '@nestjs/swagger';

export class HubsListResponseDTO extends ListResponseDTO {
  @ApiProperty({ type: [HubResponseDTO] })
  @IsArray()
  @Type(() => HubResponseDTO)
  hubs: HubResponseDTO[];
}

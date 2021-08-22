import { ListResponseDTO } from '@common/dto/response/list.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SearchListResponseDTO extends ListResponseDTO {
  @ApiProperty()
  @IsNumber()
  took: number;
}

import { PaginationQueryDTO } from '@common/dto/request/query/pagination.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class BaseSearchQueryDTO extends PaginationQueryDTO {
  @IsNotEmpty()
  @IsString()
  query: string;
}

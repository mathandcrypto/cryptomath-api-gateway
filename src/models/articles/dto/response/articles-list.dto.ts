import { IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ListResponseDTO } from '@common/dto/response/list.dto';
import { ArticleResponseDTO } from './article.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ArticlesListResponseDTO extends ListResponseDTO {
  @ApiProperty({ type: [ArticleResponseDTO] })
  @IsArray()
  @Type(() => ArticleResponseDTO)
  articles: ArticleResponseDTO[];
}

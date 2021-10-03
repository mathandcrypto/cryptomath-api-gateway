import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ExtractAvatarOptionsDTO } from './extract-avatar-options.dto';

export class SaveAvatarRequestDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty()
  @Type(() => ExtractAvatarOptionsDTO)
  @ValidateNested({ each: true })
  extract: ExtractAvatarOptionsDTO;
}

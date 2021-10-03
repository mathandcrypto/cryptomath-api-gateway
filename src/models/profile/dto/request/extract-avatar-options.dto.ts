import { ExtractAvatarOptions } from '@models/profile/interfaces/extract-avatar-options.interface';
import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExtractAvatarOptionsDTO implements ExtractAvatarOptions {
  @ApiProperty()
  @IsInt()
  left: number;

  @ApiProperty()
  @IsInt()
  top: number;

  @ApiProperty()
  @IsInt()
  size: number;
}

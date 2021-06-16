import { IsInt, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AvatarResponseDTO {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  url: string;
}

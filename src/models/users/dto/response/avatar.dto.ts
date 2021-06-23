import { IsInt, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Avatar } from '../../interfaces/avatar.interface';

export class AvatarResponseDTO implements Avatar {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  url: string;
}

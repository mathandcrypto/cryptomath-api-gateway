import { IsJWT, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshRequestDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsJWT()
  refresh_token: string;
}

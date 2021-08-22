import { IsJWT, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CaptchaGenerateResponseDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsJWT()
  token: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  math: string;
}

import { IsIn, IsJWT, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(['bearer'])
  token_type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsJWT()
  access_token: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsJWT()
  refresh_token: string;
}

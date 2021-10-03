import { IsNotEmpty, IsSemVer, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WelcomeResponseDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsSemVer()
  version: string;

  @ApiProperty()
  @IsUrl()
  documentation: string;
}

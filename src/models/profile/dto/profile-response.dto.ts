import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthUserResponseDTO } from '@auth/dto/auth-user-response.dto';

export class ProfileResponseDTO extends AuthUserResponseDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  bio: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  location: string;
}

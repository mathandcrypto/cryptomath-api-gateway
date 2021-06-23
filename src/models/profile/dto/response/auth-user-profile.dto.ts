import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthUserResponseDTO } from '@auth/dto/response/auth-user.dto';

export class AuthUserProfileResponseDTO extends AuthUserResponseDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location: string;
}

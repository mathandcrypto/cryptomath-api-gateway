import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserExtraResponseDTO } from '@auth/dto/user-extra-response.dto';

export class ProfileResponseDTO extends UserExtraResponseDTO {
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

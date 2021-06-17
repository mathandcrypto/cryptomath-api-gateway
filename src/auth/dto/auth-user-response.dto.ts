import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@common/enums/role.enum';
import { AvatarResponseDTO } from '@models/profile/dto/avatar-response.dto';

export class AuthUserResponseDTO {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  display_name: string;

  @ApiProperty({ type: AvatarResponseDTO, required: false })
  @IsOptional()
  @Type(() => AvatarResponseDTO)
  avatar: AvatarResponseDTO;
}

import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@common/enums/role.enum';
import { AvatarResponseDTO } from '@models/users/dto/response/avatar.dto';
import { AuthUser } from '../../interfaces/auth-user.interface';

export class AuthUserResponseDTO implements AuthUser {
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

  @ApiProperty()
  @IsInt()
  reputation: number;

  @ApiProperty({ type: AvatarResponseDTO, required: false })
  @IsOptional()
  @Type(() => AvatarResponseDTO)
  @ValidateNested()
  avatar: AvatarResponseDTO;

  @ApiProperty()
  @IsDate()
  created_at: Date;
}

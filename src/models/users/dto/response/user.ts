import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Role } from '@common/enums/role.enum';
import { AvatarResponseDTO } from '@models/users/dto/response/avatar.dto';
import { Type } from 'class-transformer';
import { User } from '../../interfaces/user.interface';

export class UserResponseDTO implements User {
  @ApiProperty()
  @IsInt()
  id: number;

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

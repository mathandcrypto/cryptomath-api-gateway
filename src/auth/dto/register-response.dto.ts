import { IsEmail, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDTO {
  @ApiProperty()
  @IsInt()
  user_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

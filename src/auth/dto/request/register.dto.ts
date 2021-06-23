import {
  IsJWT,
  IsNotEmpty,
  IsInt,
  IsString,
  IsEmail,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsJWT()
  captcha_token: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  captcha_answer: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  display_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

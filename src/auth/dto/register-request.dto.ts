import {
  IsJWT,
  IsNotEmpty,
  IsInt,
  IsString,
  IsEmail,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterRequestDTO {
  @IsNotEmpty()
  @IsJWT()
  captcha_token: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  captcha_answer: number;

  @IsNotEmpty()
  @IsString()
  display_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

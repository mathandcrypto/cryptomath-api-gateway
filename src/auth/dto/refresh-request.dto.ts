import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshRequestDTO {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}

import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshRequestDTO {
  @IsNotEmpty()
  @IsJWT()
  refresh_token: string;
}

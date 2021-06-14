import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UploadAvatarResponseDTO {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}

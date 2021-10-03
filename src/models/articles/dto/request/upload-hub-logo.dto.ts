import { ApiProperty } from '@nestjs/swagger';
import { Multipart } from 'fastify-multipart';

export class UploadHubLogoRequestDTO {
  @ApiProperty({
    type: 'file',
    properties: {
      avatar: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  logo: Multipart;
}

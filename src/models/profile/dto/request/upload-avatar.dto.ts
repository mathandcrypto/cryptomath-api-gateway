import { ApiProperty } from '@nestjs/swagger';
import { Multipart } from 'fastify-multipart';

export class UploadAvatarRequestDTO {
  @ApiProperty({
    type: 'file',
    properties: {
      avatar: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  avatar: Multipart;
}

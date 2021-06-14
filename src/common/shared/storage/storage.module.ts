import { Module } from '@nestjs/common';
import { ImageStorage } from './adapters/image-storage.adapter';

const storageFactory = {
  provide: 'IMAGE_STORAGE',
  useClass: ImageStorage,
};

@Module({
  providers: [storageFactory],
  exports: [storageFactory],
})
export class StorageModule {}

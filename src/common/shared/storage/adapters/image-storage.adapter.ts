import { StorageAbstract } from '../storage.abstract';
import { createWriteStream, createReadStream } from 'fs';
import { tmpdir } from 'os';
import * as sharp from 'sharp';
import { ResizeOptions } from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { StorageException } from '../exceptions/storage.exception';
import { StorageError } from '../enums/errors/storage.enum';

export class ImageStorage extends StorageAbstract {
  protected options: ResizeOptions;

  get isImageFile() {
    const multipart = this.getMultipart();

    return ['image/gif', 'image/jpeg', 'image/png'].includes(
      multipart.mimetype,
    );
  }

  setOptions(options: ResizeOptions) {
    this.options = options;
  }

  protected reset() {
    this.options = null;
  }

  protected async resize(filePath: string): Promise<string> {
    const tmpFilePath = join(tmpdir(), `resized_${uuidv4()}`);
    const readStream = createReadStream(filePath);
    const writeStream = createWriteStream(tmpFilePath);
    const sharpPipe = sharp().resize(this.options);

    return new Promise<string>((resolve, reject) => {
      readStream
        .pipe(sharpPipe)
        .pipe(writeStream)
        .on('error', (error) =>
          reject(
            new StorageException(error.message, StorageError.ResizeImageError),
          ),
        )
        .on('finish', () => resolve(tmpFilePath));
    });
  }

  async getStream() {
    const tmpFilePath = await this.saveAsTemp();
    const resizedFilePath = await this.resize(tmpFilePath);

    this.reset();

    return createReadStream(resizedFilePath);
  }
}

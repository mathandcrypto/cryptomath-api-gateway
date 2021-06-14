import { Multipart } from 'fastify-multipart';
import { join, extname } from 'path';
import * as fs from 'fs';
import { ReadStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { StorageException } from './exceptions/storage.exception';
import { StorageError } from './enums/storage-error.enum';

export abstract class StorageAbstract {
  private multipart: Multipart;

  setMultipart(multipart: Multipart) {
    this.multipart = multipart;
  }

  protected getMultipart() {
    return this.multipart;
  }

  get fileExtension() {
    return extname(this.multipart.filename);
  }

  protected async saveAsTemp(): Promise<string> {
    const tmpFilePath = join('/tmp', uuidv4());
    const writeStream = fs.createWriteStream(tmpFilePath);

    return new Promise<string>((resolve, reject) => {
      this.multipart.file
        .pipe(writeStream)
        .on('error', (error) =>
          reject(
            new StorageException(error.message, StorageError.SaveTempFileError),
          ),
        )
        .on('finish', () => resolve(tmpFilePath));
    });
  }

  abstract getStream(): Promise<ReadStream>;
}

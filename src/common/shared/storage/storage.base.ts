import { join } from 'path';
import { createWriteStream } from 'fs';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';
import { StorageException } from './exceptions/storage.exception';
import { StorageError } from './enums/errors/storage.enum';
import { Readable, Duplex } from 'stream';

export class StorageBase {
  constructor(private readonly file: Readable) {}

  async saveAsTemp(prefix: string, externalPipe: Duplex): Promise<string> {
    const tmpFilePath = join(tmpdir(), `${prefix}_${uuidv4()}`);
    const writeStream = createWriteStream(tmpFilePath);

    return new Promise<string>((resolve, reject) => {
      this.file
        .pipe(externalPipe)
        .pipe(writeStream)
        .on('error', (error) =>
          reject(
            new StorageException(error.message, StorageError.SaveTempFileError),
          ),
        )
        .on('finish', () => resolve(tmpFilePath));
    });
  }
}

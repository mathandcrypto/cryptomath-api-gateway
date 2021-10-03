import { StorageBase } from './storage.base';
import { createWriteStream, createReadStream } from 'fs';
import { tmpdir } from 'os';
import * as sharp from 'sharp';
import { OutputInfo, Region, ResizeOptions } from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { StorageException } from './exceptions/storage.exception';
import {
  AllowedImageOutputFormat,
  ImageStorageOptions,
} from './interfaces/image-storage-options.interface';
import { StorageError } from './enums/errors/storage.enum';
import { Readable } from 'stream';

export class ImageStorage extends StorageBase {
  private readonly allowedFormats: string[];
  private readonly minWidth: number;
  private readonly minHeight: number;
  private readonly maxSize: number;
  private readonly outputFormat: AllowedImageOutputFormat;
  private outputInfo: OutputInfo;

  constructor(file: Readable, options?: ImageStorageOptions) {
    super(file);

    this.allowedFormats = options?.allowedFormats || ['gif', 'jpeg', 'png'];
    this.minWidth = options?.minWidth || 200;
    this.minHeight = options?.minHeight || 200;
    this.maxSize = options?.maxSize || 500 * 1000;
    this.outputFormat = options?.outputFormat || 'png';
  }

  async init(): Promise<string> {
    const sharpPipe = sharp()
      .toFormat(this.outputFormat)
      .on('info', (info: OutputInfo) => {
        this.outputInfo = info;
      });

    return await this.saveAsTemp('image', sharpPipe);
  }

  get imageSize() {
    const { width, height } = this.outputInfo;

    return [width, height];
  }

  get imageExtension() {
    return this.outputInfo.format;
  }

  get isValidImageFile() {
    return this.allowedFormats.includes(this.outputInfo.format);
  }

  get isValidImageSize() {
    const [width, height] = this.imageSize;

    return width >= this.minWidth && height >= this.minHeight;
  }

  get isValidImageFileSize() {
    return this.outputInfo.size <= this.maxSize;
  }

  async resize(
    filePath: string,
    regionOptions: Region,
    resizeOptions?: ResizeOptions,
  ): Promise<string> {
    const tmpFilePath = join(tmpdir(), `image_resized_${uuidv4()}`);
    const readStream = createReadStream(filePath);
    const writeStream = createWriteStream(tmpFilePath);
    const sharpPipe = sharp().extract(regionOptions);

    if (resizeOptions) {
      sharpPipe.resize(resizeOptions);
    }

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
}

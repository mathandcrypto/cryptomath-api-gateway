export type AllowedImageOutputFormat = 'jpeg' | 'png' | 'gif';

export interface ImageStorageOptions {
  allowedFormats?: string[];
  minWidth?: number;
  minHeight?: number;
  maxSize?: number;
  outputFormat?: AllowedImageOutputFormat;
}

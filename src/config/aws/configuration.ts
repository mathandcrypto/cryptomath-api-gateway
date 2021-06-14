import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  userAssetsBucketName: process.env.AWS_USER_ASSETS_BUCKET_NAME,
  tmpObjectsPrefix: process.env.AWS_TMP_OBJECTS_PREFIX,
}));

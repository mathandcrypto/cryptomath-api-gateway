export interface AwsConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  userAssetsBucketName: string;
  hubsAssetsBucketName: string;
  tmpObjectsPrefix: string;
}

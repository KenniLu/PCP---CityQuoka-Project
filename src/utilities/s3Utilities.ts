import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import {getS3StorageConfig} from '@/config/s3Config'



export async function getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const {bucket, config} = getS3StorageConfig();
  const s3Client = new S3Client(config);
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  // URL valid for 1 hour
  return awsGetSignedUrl(s3Client, command, { expiresIn });
}
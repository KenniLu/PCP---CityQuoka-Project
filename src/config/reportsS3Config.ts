// src/config/s3Config.ts
import { S3ClientConfig } from '@aws-sdk/client-s3';

const isProduction = process.env.NODE_ENV === 'production';

// Base configuration that's common across environments
const baseS3Config: Partial<S3ClientConfig> = {
  region: process.env._AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env._AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env._AWS_SECRET_ACCESS_KEY as string,
  },
};

// Development-specific configuration
const developmentConfig: Partial<S3ClientConfig> = {
  ...baseS3Config,
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
};

// Production-specific configuration
const productionConfig: S3ClientConfig = {
  ...baseS3Config,
  // Add any production-specific settings here
  maxAttempts: 3, // Retry configuration for production
};

// Create the environment-specific configuration
export const s3Config = isProduction ? productionConfig : developmentConfig;

// Create the S3 client with the appropriate configuration
// export const s3Client = new S3Client(s3Config);

// Helper function to get the appropriate bucket name
export const getS3BucketName = () => process.env.REPORTS_S3_BUCKET!

// Payload plugin configuration
export const getReportsS3Config = () => ({
  // client: s3Client,
  reportS3Bucket: getS3BucketName(),
  reportS3config: s3Config
});
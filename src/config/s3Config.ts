// src/config/s3Config.ts
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Base configuration that's common across environments
const baseS3Config: Partial<S3ClientConfig> = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
  },
};

// Development-specific configuration
const developmentConfig: Partial<S3ClientConfig> = {
  ...baseS3Config,
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:4566',
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
export const getS3BucketName = () => {
  return isDevelopment
    ? process.env.DEV_S3_BUCKET || 'cq-local-bucket'
    : process.env.PROD_S3_BUCKET || 'cq-production-bucket';
};

// Payload plugin configuration
export const getS3StorageConfig = () => ({
  // client: s3Client,
  bucket: getS3BucketName(),
  config: s3Config
});
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { r2Env } from './env';

function r2() {
  const configuration = r2Env();
  return new S3Client({
    region: 'auto',
    endpoint: `https://${configuration.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: configuration.R2_ACCESS_KEY_ID, secretAccessKey: configuration.R2_SECRET_ACCESS_KEY },
  });
}

export async function uploadFile(key: string, file: File) {
  const configuration = r2Env();
  await r2().send(new PutObjectCommand({ Bucket: configuration.R2_BUCKET, Key: key, Body: Buffer.from(await file.arrayBuffer()), ContentType: file.type || 'application/octet-stream' }));
  return configuration.R2_PUBLIC_BASE_URL ? `${configuration.R2_PUBLIC_BASE_URL.replace(/\/$/, '')}/${key}` : key;
}

export async function removeFile(key: string) {
  await r2().send(new DeleteObjectCommand({ Bucket: r2Env().R2_BUCKET, Key: key }));
}

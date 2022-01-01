import type { Options } from 'ali-oss';
export const OssConfig: Options = {
  region: process.env.OSS_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  accessKeySecret: process.env.ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
  secure: true,
};

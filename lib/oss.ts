import OSS from 'ali-oss';
import { OssConfig } from '@/config/oss';
const ossClient = new OSS(OssConfig);

export default ossClient;
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'kaixa-development-bucket.oss-cn-beijing.aliyuncs.com',
      'kaixa-staging-bucket.oss-cn-beijing.aliyuncs.com',
      'kaixa-production-bucket.oss-cn-beijing.aliyuncs.com',
    ],
  },
};

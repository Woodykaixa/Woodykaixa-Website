export const SiteConfig = {
  title: '卡夏妙妙屋',
  url: process.env.NEXT_PUBLIC_BASE_URL,
  /**
   * Length of avatar's width and height, make is square
   */
  avatarSize: 250,
  imageBucket: `https://${process.env.NEXT_PUBLIC_OSS_BUCKET}.${process.env.NEXT_PUBLIC_OSS_REGION}.aliyuncs.com/IMAGE/`,
};

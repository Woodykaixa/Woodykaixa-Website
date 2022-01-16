import { SiteConfig } from '@/config/site';

export function OmniImage(props: { alt: string; src: string; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={props.className + ' max-w-full'}
      src={props.src.startsWith('@') ? SiteConfig.imageBucket + props.src.substring(1) : props.src}
      alt={props.alt}
    />
  );
}

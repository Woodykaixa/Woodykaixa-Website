import { SiteConfig } from '@/config/site';
import Image from 'next/image';

export function OmniImage(props: { alt: string; src: string; className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={'max-w-full max-h-full object-contain object-center ' + props.className ?? ''}
      src={props.src.startsWith('@') ? SiteConfig.imageBucket + props.src.substring(1) : props.src}
      alt={props.alt}
    />
  );
}

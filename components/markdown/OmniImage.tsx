import { SiteConfig } from '@/config/site';
import Image from 'next/image';
import { CSSProperties } from 'styled-components';

export function OmniImage(props: { alt?: string; src: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={
        'w-full md:max-w-1/2 px-2 max-h-full md:translate-x-1/2 object-contain object-center ' + props.className ?? ''
      }
      src={props.src.startsWith('@') ? SiteConfig.imageBucket + props.src.substring(1) : props.src}
      alt={props.alt}
    />
  );
}

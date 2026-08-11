import Image from 'next/image';
import { forwardRef } from 'react';

import { LOGO_ASPECT_RATIO, LOGO_HEIGHT, LOGO_SRC } from '@/parameters';

interface Props {
  className?: string;
}

export const Logo = forwardRef<HTMLImageElement, Props>((props, ref) => (
  <Image
    {...props}
    alt="Scrabble Solver 2"
    height={LOGO_HEIGHT}
    priority
    ref={ref}
    src={LOGO_SRC}
    width={Math.round(LOGO_HEIGHT * LOGO_ASPECT_RATIO)}
  />
));

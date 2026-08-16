import Image from 'next/image';
import { forwardRef } from 'react';

import { LOGO_HEIGHT, LOGO_SRC, LOGO_WIDTH } from '@/parameters';

interface Props {
  className?: string;
}

export const Logo = forwardRef<HTMLImageElement, Props>((props, ref) => (
  <Image {...props} alt="Scrabble Solver 2" height={LOGO_HEIGHT} priority ref={ref} src={LOGO_SRC} width={LOGO_WIDTH} />
));

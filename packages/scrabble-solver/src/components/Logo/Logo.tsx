import Image from 'next/image';
import { forwardRef } from 'react';

import { useAppLayout } from 'hooks';
import { LOGO_SRC } from 'parameters';

interface Props {
  className?: string;
}

export const Logo = forwardRef<HTMLImageElement, Props>((props, ref) => {
  const { logoHeight, logoWidth } = useAppLayout();

  return (
    <Image {...props} alt="Scrabble Solver 2" height={logoHeight} priority ref={ref} src={LOGO_SRC} width={logoWidth} />
  );
});

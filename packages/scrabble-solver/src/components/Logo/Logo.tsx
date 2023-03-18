import Image from 'next/image';
import { forwardRef } from 'react';

import { useAppLayout } from 'hooks';

interface Props {
  className?: string;
}

const Logo = forwardRef<HTMLImageElement, Props>((props, ref) => {
  const { logoHeight, logoWidth } = useAppLayout();

  return <Image {...props} alt="Scrabble Solver 2" height={logoHeight} ref={ref} src="/logo.svg" width={logoWidth} />;
});

export default Logo;

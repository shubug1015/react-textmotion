import { useMemo } from 'react';

import type { SplitType } from '../../types';

export const useSplitText = (text: string, split: SplitType): string[] => {
  const splittedTexts = useMemo(() => {
    if (split === 'character') return text.split('');
    if (split === 'word') return text.split(/(\s+)/);
    if (split === 'line') return text.split(/(\n)/);

    return text.split('');
  }, [text, split]);

  return splittedTexts;
};

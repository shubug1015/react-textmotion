import type { SplitType } from '../../types';

export const splitText = (text: string, split: SplitType): string[] => {
  if (split === 'character') return text.split('');
  if (split === 'word') return text.split(/(\s+)/);
  if (split === 'line') return text.split(/(\n)/);
  return text.split('');
};

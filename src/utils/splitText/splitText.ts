import type { SplitType } from '../../types';

export const splitText = (text: string, split: SplitType): string[] => {
  switch (split) {
    case 'word':
      return text.split(/(\s+)/);
    case 'line':
      return text.split(/(\n)/);
    case 'character':
    default:
      return text.split('');
  }
};

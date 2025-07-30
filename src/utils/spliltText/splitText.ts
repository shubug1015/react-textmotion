import type { SplitType } from '../../components/TextMotion/TextMotion';

export const splitText = (text: string, split: SplitType): string[] => {
  if (split === 'character') return text.split('');
  if (split === 'word') return text.split(/(\s+)/);
  return text.split('');
};

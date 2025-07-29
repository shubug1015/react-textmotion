import './TextMotion.scss';

import React, { useMemo } from 'react';

type PresetType = 'fadeIn' | 'fadeOut' | 'slideUp' | 'slideDown';
type SplitType = 'character' | 'word';

type TextMotionProps = {
  as?: keyof React.JSX.IntrinsicElements;
  text: string;
  presets?: PresetType[];
  split?: SplitType;
};

const DEFAULT_DURATION = 0.25;
const DEFAULT_DELAY = 0.025;

const generateAnimationByPresets = (presets: PresetType[], index: number): React.CSSProperties => {
  const formattedDelay = parseFloat((index * DEFAULT_DELAY).toFixed(3));
  const animation = presets.map(preset => `${preset} ${DEFAULT_DURATION}s ease-out ${formattedDelay}s both`).join(', ');

  return { animation };
};

export const splitText = (text: string, split: SplitType): string[] => {
  if (split === 'character') return text.split('');
  if (split === 'word') return text.split(/(\s+)/);
  return text.split('');
};

export const TextMotion = ({ as = 'span', text, presets = ['fadeIn'], split = 'character' }: TextMotionProps) => {
  const Tag = as;
  const letters = useMemo(() => splitText(text, split), [text, split]);

  return (
    <Tag className="text-motion" aria-label={text}>
      {letters.map((letter, index) => (
        <span key={`${letter}-${index}`} style={generateAnimationByPresets(presets, index)} aria-hidden="true">
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </Tag>
  );
};

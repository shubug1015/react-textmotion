import './TextMotion.scss';

import React, { useMemo } from 'react';

export type SplitType = 'character' | 'word';

type TextMotionProps = {
  as?: keyof React.JSX.IntrinsicElements;
  text: string;
  split?: SplitType;
};

const DEFAULT_DURATION = 0.25;
const DEFAULT_DELAY = 0.025;

export const splitText = (text: string, split: SplitType): string[] => {
  if (split === 'character') return text.split('');
  if (split === 'word') return text.split(/(\s+)/);
  return text.split('');
};

export const TextMotion: React.FC<TextMotionProps> = ({ as = 'span', text, split = 'character' }) => {
  const Tag = as;
  const letters = useMemo(() => splitText(text, split), [text, split]);

  return (
    <Tag className="text-motion" aria-label={text}>
      {letters.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          style={
            {
              '--duration': `${DEFAULT_DURATION}s`,
              '--delay': `${index * DEFAULT_DELAY}s`,
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </Tag>
  );
};

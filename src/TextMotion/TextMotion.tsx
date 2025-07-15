import './TextMotion.scss';

import React, { useMemo } from 'react';

type TextMotionProps = {
  as?: keyof React.JSX.IntrinsicElements;
  text: string;
};

const DEFAULT_DURATION = 0.25;
const DEFAULT_DELAY = 0.025;

export const TextMotion: React.FC<TextMotionProps> = ({ as = 'span', text }) => {
  const Tag = as;
  const letters = useMemo(() => text.split(''), [text]);

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

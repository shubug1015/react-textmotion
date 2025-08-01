import './TextMotion.scss';
import '../../styles/animations.scss';

import React, { useMemo } from 'react';

import { mergeMotion, splitText } from '../../utils';

type PresetType = 'fade' | 'slide';
export type MotionType = Partial<Record<PresetType, { duration: number; delay: number }>>;
export type SplitType = 'character' | 'word';

type TextMotionProps = {
  as?: keyof React.JSX.IntrinsicElements;
  text: string;
  motion?: MotionType;
  split?: SplitType;
};

export const TextMotion: React.FC<TextMotionProps> = ({ as = 'span', text, motion, split = 'character' }) => {
  const Tag = as;

  const letters = useMemo(() => splitText(text, split), [text, split]);
  const mergedMotion = useMemo(() => mergeMotion(motion), [motion]);

  return (
    <Tag className="text-motion" aria-label={text}>
      {letters.map((letter, index) => {
        const animation = (Object.keys(mergedMotion) as PresetType[])
          .map(name => {
            const { duration, delay } = mergedMotion[name]!;
            const totalDelay = index * delay;
            return `${name} ${duration}s ease-out ${totalDelay}s both`;
          })
          .join(', ');

        return (
          <span key={`${letter}-${index}`} style={{ animation }} aria-hidden="true">
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        );
      })}
    </Tag>
  );
};

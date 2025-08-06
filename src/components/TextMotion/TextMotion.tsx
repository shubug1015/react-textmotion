import './TextMotion.scss';
import '../../styles/animations.scss';

import React, { useMemo } from 'react';

import { generateAnimation, mergeMotion, splitText } from '../../utils';

export type SplitType = 'character' | 'word';
export type VariantType = 'fade' | 'slide';

type FadeVariant = 'in' | 'out';
type SlideVariant = 'up' | 'down' | 'right' | 'left';

type Motion<V extends string> = {
  variant: V;
  duration: number;
  delay: number;
};

export type MotionConfig = {
  fade?: Motion<FadeVariant>;
  slide?: Motion<SlideVariant>;
};

type TextMotionProps = {
  as?: keyof React.JSX.IntrinsicElements;
  text: string;
  split?: SplitType;
  motion?: MotionConfig;
};

export const TextMotion: React.FC<TextMotionProps> = ({ as: Tag = 'span', text, motion, split = 'character' }) => {
  const letters = useMemo(() => splitText(text, split), [text, split]);
  const mergedMotion = useMemo(() => mergeMotion(motion), [motion]);

  return (
    <Tag className="text-motion" aria-label={text}>
      {letters.map((letter, index) => {
        const animation = generateAnimation(mergedMotion, index);

        return (
          <span key={`${letter}-${index}`} style={{ animation }} aria-hidden="true">
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        );
      })}
    </Tag>
  );
};

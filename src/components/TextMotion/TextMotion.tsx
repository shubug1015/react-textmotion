import './TextMotion.scss';
import '../../styles/animations.scss';

import React, { useMemo } from 'react';

import { mergeMotion, splitText } from '../../utils';

export type PresetType = 'fade' | 'slide';

type FadePreset = 'in' | 'out';
type SlidePreset = 'up' | 'down' | 'right' | 'left';

type FadeMotion = {
  preset: FadePreset;
  duration: number;
  delay: number;
};

type SlideMotion = {
  preset: SlidePreset;
  duration: number;
  delay: number;
};

export type MotionType = {
  fade?: FadeMotion;
  slide?: SlideMotion;
};

export type SplitType = 'character' | 'word';

type TextMotionProps = {
  as?: keyof React.JSX.IntrinsicElements;
  text: string;
  motion?: MotionType;
  split?: SplitType;
};

export const TextMotion: React.FC<TextMotionProps> = ({ as: Tag = 'span', text, motion, split = 'character' }) => {
  const letters = useMemo(() => splitText(text, split), [text, split]);
  const mergedMotion = useMemo(() => mergeMotion(motion), [motion]);

  return (
    <Tag className="text-motion" aria-label={text}>
      {letters.map((letter, index) => {
        const animation = (Object.keys(mergedMotion) as PresetType[])
          .map(name => {
            const { preset, duration, delay } = mergedMotion[name]!;
            const totalDelay = index * delay;
            return `${name}-${preset} ${duration}s ease-out ${totalDelay}s both`;
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

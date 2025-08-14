import './TextMotion.scss';
import '../../styles/animations.scss';

import React, { useMemo } from 'react';

import { MotionConfig, SplitType } from '../../types';
import { generateAnimation, mergeMotion, splitText } from '../../utils';

type TextMotionProps = {
  as?: keyof React.JSX.IntrinsicElements;
  text: string;
  split?: SplitType;
  motion?: MotionConfig;
};

export const TextMotion: React.FC<TextMotionProps> = ({ as: Tag = 'span', text, split = 'character', motion }) => {
  const textSegments = useMemo(() => splitText(text, split), [text, split]);
  const mergedMotion = useMemo(() => mergeMotion(motion), [motion]);

  return (
    <Tag className="text-motion" aria-label={text}>
      {textSegments.map((segment, index) => {
        const animation = generateAnimation(mergedMotion, index);

        if (segment === '\n') {
          return <br key={`br-${index}`} />;
        }
        return (
          <span key={`${segment}-${index}`} style={{ animation }} aria-hidden="true">
            {segment === ' ' ? '\u00A0' : segment}
          </span>
        );
      })}
    </Tag>
  );
};

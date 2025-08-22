import '../../styles/animations.scss';
import '../../styles/motion.scss';

import React, { ElementType, ReactNode, useMemo } from 'react';

import { MotionConfig, SplitType } from '../../types';
import { extractText, generateAnimation, mergeMotion, splitText } from '../../utils';

type NodeMotionProps = {
  as?: ElementType;
  children: ReactNode;
  split?: SplitType;
  motion?: MotionConfig;
};

export const NodeMotion: React.FC<NodeMotionProps> = ({ as: Tag = 'span', children, split = 'character', motion }) => {
  const rawText = useMemo(() => extractText(children), [children]);
  const textSegments = useMemo(() => splitText(rawText, split), [rawText, split]);
  const mergedMotion = useMemo(() => mergeMotion(motion), [motion]);

  return (
    <Tag className="motion" aria-label={rawText}>
      {textSegments.map((segment, index) => {
        const animation = generateAnimation(mergedMotion, index);

        return (
          <span key={`${segment}-${index}`} style={{ animation }} aria-hidden="true">
            {segment === ' ' ? '\u00A0' : segment}
          </span>
        );
      })}
    </Tag>
  );
};

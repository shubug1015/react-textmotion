import '../../styles/animations.scss';
import '../../styles/motion.scss';

import React, { ElementType, ReactNode, useMemo } from 'react';

import { MotionConfig, SplitType } from '../../types';
import { generateAnimation, getTextFromReactNode, mergeMotion, splitText } from '../../utils';

type NodeMotionProps = {
  as?: ElementType;
  children: ReactNode;
  split?: SplitType;
  motion?: MotionConfig;
};

const wrapWithAnimation = (text: string, index: number, motion: MotionConfig): React.ReactElement => {
  const animation = generateAnimation(motion, index);

  return (
    <span key={index} style={{ animation }} aria-hidden="true">
      {text}
    </span>
  );
};

export const NodeMotion: React.FC<NodeMotionProps> = ({ as: Tag = 'span', children, split = 'character', motion }) => {
  const rawText = useMemo(() => getTextFromReactNode(children), [children]);
  const textSegments = useMemo(() => splitText(rawText, split), [rawText, split]);
  const mergedMotion = useMemo(() => mergeMotion(motion), [motion]);

  return (
    <Tag className="motion" aria-label={rawText}>
      {textSegments.map((segment, index) => wrapWithAnimation(segment, index, mergedMotion))}
    </Tag>
  );
};

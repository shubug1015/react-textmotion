import './NodeMotion.scss';
import '../../styles/animations.scss';

import React, { ElementType, isValidElement, ReactNode, useMemo } from 'react';

import { MotionConfig, SplitType } from '../../types';
import { generateAnimation, mergeMotion, splitText } from '../../utils';

type NodeMotionProps = {
  as?: ElementType;
  children: ReactNode;
  split?: SplitType;
  motion?: MotionConfig;
};

const extractText = (children: ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }

  if (typeof children === 'number') {
    return children.toString();
  }

  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }

  if (isValidElement(children)) {
    return extractText((children.props as { children?: ReactNode }).children);
  }

  return '';
};

export const NodeMotion: React.FC<NodeMotionProps> = ({ as: Tag = 'span', children, split = 'character', motion }) => {
  const rawText = useMemo(() => extractText(children), [children]);
  const textSegments = useMemo(() => splitText(rawText, split), [rawText, split]);
  const mergedMotion = useMemo(() => mergeMotion(motion), [motion]);

  return (
    <Tag className="node-motion" aria-label={rawText}>
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

import '../../styles/animations.scss';
import '../../styles/motion.scss';

import React, { cloneElement, ElementType, isValidElement, ReactNode, useMemo } from 'react';

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

const animateNode = (node: ReactNode, motion: MotionConfig, split: SplitType, startIndex = 0): [ReactNode, number] => {
  if (typeof node === 'string') {
    const segments = splitText(node, split);
    const animated = segments.map((segment, index) => wrapWithAnimation(segment, startIndex + index, motion));

    return [animated, startIndex + segments.length];
  }

  if (typeof node === 'number') {
    const segments = splitText(node.toString(), split);
    const animated = segments.map((segment, index) => wrapWithAnimation(segment, startIndex + index, motion));

    return [animated, startIndex + segments.length];
  }

  if (Array.isArray(node)) {
    let index = startIndex;
    const result = node.map(child => {
      const [animated, nextIndex] = animateNode(child, motion, split, index);

      index = nextIndex;

      return animated;
    });

    return [result, index];
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    const [animatedChildren, nextIndex] = animateNode(node.props.children, motion, split, startIndex);

    return [cloneElement(node, { key: startIndex }, animatedChildren), nextIndex];
  }

  return [node, startIndex];
};

export const NodeMotion: React.FC<NodeMotionProps> = ({ as: Tag = 'span', children, split = 'character', motion }) => {
  const rawText = useMemo(() => getTextFromReactNode(children), [children]);
  const mergedMotion = useMemo(() => mergeMotion(motion), [motion]);
  const [animatedNode] = useMemo(() => animateNode(children, mergedMotion, split, 0), [children, mergedMotion, split]);

  return (
    <Tag className="motion" aria-label={rawText}>
      {animatedNode}
    </Tag>
  );
};

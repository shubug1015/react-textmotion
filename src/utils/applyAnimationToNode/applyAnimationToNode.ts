import { Children, cloneElement, isValidElement, ReactNode } from 'react';

import { MotionConfig, SplitType } from '../../types';
import { createAnimatedSpan } from '../createAnimatedSpan';
import { splitText } from '../splitText';

export const applyAnimationToNode = (
  node: ReactNode,
  motion: MotionConfig,
  split: SplitType,
  sequenceIndexRef: { current: number }
): ReactNode => {
  if (typeof node === 'string') {
    const textSegments = splitText(node, split);

    return textSegments.map(segment => createAnimatedSpan(segment, sequenceIndexRef.current++, motion));
  }

  if (typeof node === 'number') {
    const textSegments = splitText(node.toString(), split);

    return textSegments.map(segment => createAnimatedSpan(segment, sequenceIndexRef.current++, motion));
  }

  if (Array.isArray(node)) {
    return Children.map(node, child => applyAnimationToNode(child, motion, split, sequenceIndexRef));
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    const originalElement = node;
    const animatedChildNodes = applyAnimationToNode(originalElement.props.children, motion, split, sequenceIndexRef);
    const normalizedChildren = Array.isArray(animatedChildNodes)
      ? (animatedChildNodes as ReactNode[])
      : [animatedChildNodes];

    return cloneElement(originalElement, { key: sequenceIndexRef.current++ }, ...normalizedChildren);
  }

  return node;
};

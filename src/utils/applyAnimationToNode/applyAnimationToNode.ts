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
    const splittedText = splitText(node, split);

    return splittedText.map(splittedText => createAnimatedSpan(splittedText, sequenceIndexRef.current++, motion));
  }

  if (typeof node === 'number') {
    const splittedText = splitText(node.toString(), split);

    return splittedText.map(splittedText => createAnimatedSpan(splittedText, sequenceIndexRef.current++, motion));
  }

  if (Array.isArray(node)) {
    return Children.map(node, child => applyAnimationToNode(child, motion, split, sequenceIndexRef));
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    const animatedChildren = applyAnimationToNode(node.props.children, motion, split, sequenceIndexRef);

    return cloneElement(node, { key: sequenceIndexRef.current++, children: animatedChildren });
  }

  return node;
};

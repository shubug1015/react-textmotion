import { Children, cloneElement, isValidElement, ReactNode } from 'react';

import { MotionConfig, SplitType } from '../../types';
import { createAnimatedSpan } from '../createAnimatedSpan';
import { splitText } from '../splitText';

/**
 * @description
 * `applyAnimationToNode` is a recursive function that traverses a React node and its children,
 * applying animations to text nodes and cloning React elements with animated children.
 *
 * @param {ReactNode} node - The React node to process.
 * @param {MotionConfig} motion - The motion configuration to apply.
 * @param {SplitType} split - The split type for text animations (`character`, `word`, or `line`).
 * @param {{ current: number }} sequenceIndexRef - A mutable ref object to keep track of the animation sequence index.
 *
 * @returns {ReactNode} The processed React node with animations applied.
 */
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

import { cloneElement, isValidElement, ReactNode } from 'react';

import { MotionConfig, SplitType } from '../../types';
import { createAnimatedSpan } from '../createAnimatedSpan';
import { splitText } from '../splitText';

/**
 * @description
 * `applyAnimationToNode` is a recursive pure function that traverses a React node and its children,
 * applying animations to text nodes and cloning React elements with animated children.
 *
 * @param {ReactNode} node - The React node to process.
 * @param {MotionConfig} motion - The motion configuration to apply.
 * @param {SplitType} split - The split type for text animations (`character` or `word`).
 * @param {number} sequenceIndex - The starting sequence index for the animation.
 *
 * @returns {{ nodes: ReactNode[]; nextSequenceIndex: number }} An object containing the array of animated nodes and the next available sequence index.
 */
export const applyAnimationToNode = (
  node: ReactNode,
  motion: MotionConfig,
  split: SplitType,
  sequenceIndex: number
): { nodes: ReactNode[]; nextSequenceIndex: number } => {
  let currentIndex = sequenceIndex;

  if (typeof node === 'string' || typeof node === 'number') {
    const text = typeof node === 'number' ? node.toString() : node;
    const splittedText = splitText(text, split);

    const animatedNodes = splittedText.map(textSegment => {
      const animatedSpan = createAnimatedSpan(textSegment, currentIndex, motion);
      currentIndex++;
      return animatedSpan;
    });

    return { nodes: animatedNodes, nextSequenceIndex: currentIndex };
  }

  if (Array.isArray(node)) {
    const collectedNodes: ReactNode[] = [];

    for (const child of node) {
      const result = applyAnimationToNode(child, motion, split, currentIndex);
      collectedNodes.push(...result.nodes);
      currentIndex = result.nextSequenceIndex;
    }

    return { nodes: collectedNodes, nextSequenceIndex: currentIndex };
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    const childrenResult = applyAnimationToNode(node.props.children, motion, split, currentIndex);
    const parentKeyIndex = childrenResult.nextSequenceIndex;

    const animatedElement = cloneElement(node, {
      key: parentKeyIndex,
      children: childrenResult.nodes,
    });

    const nextIndex = parentKeyIndex + 1;

    return { nodes: [animatedElement], nextSequenceIndex: nextIndex };
  }

  if (node === null || typeof node === 'undefined' || typeof node === 'boolean') {
    return { nodes: [], nextSequenceIndex: sequenceIndex };
  }

  return { nodes: [node], nextSequenceIndex: sequenceIndex };
};

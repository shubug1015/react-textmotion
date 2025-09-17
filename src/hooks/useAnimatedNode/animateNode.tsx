import { cloneElement, isValidElement, ReactNode } from 'react';

import { AnimatedSpan } from '../../components/AnimatedSpan';
import { AnimationPreset, MotionConfig, SplitType } from '../../types';
import { splitText } from '../../utils/splitText';

/**
 * @description
 * `animateNode` is a recursive pure function that traverses a React node and its children,
 * applying animations to text nodes and cloning React elements with animated children.
 *
 * @param {ReactNode} node - The React node to process.
 * @param {SplitType} split - The split type for text animations (`character` or `word`).
 * @param {MotionConfig} motion - The motion configuration to apply.
 * @param {AnimationPreset[]} preset - The animation presets to apply.
 * @param {number} sequenceIndex - The starting sequence index for the animation.
 *
 * @returns {{ nodes: ReactNode[]; count: number }} An object containing the array of animated nodes and the count of index.
 */
export const animateNode = (
  node: ReactNode,
  split: SplitType,
  initialDelay: number,
  motion?: MotionConfig,
  preset?: AnimationPreset[],
  sequenceIndex: number = 0
): { nodes: ReactNode[]; count: number } => {
  if (typeof node === 'string' || typeof node === 'number') {
    const text = String(node);
    const splittedText = splitText(text, split);

    return {
      nodes: [
        <AnimatedSpan
          key={`${text}-${sequenceIndex}`}
          splittedText={splittedText}
          initialDelay={initialDelay}
          motion={motion}
          preset={preset}
          sequenceIndex={sequenceIndex}
        />,
      ],
      count: splittedText.length,
    };
  }

  if (Array.isArray(node)) {
    return node.reduce(
      (acc, child) => {
        const { nodes: childNodes, count } = animateNode(
          child,
          split,
          initialDelay,
          motion,
          preset,
          sequenceIndex + acc.count
        );

        acc.nodes.push(...childNodes);
        acc.count += count;

        return acc;
      },
      { nodes: [] as ReactNode[], count: 0 }
    );
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    const { nodes: childrenNodes, count } = animateNode(
      node.props.children,
      split,
      initialDelay,
      motion,
      preset,
      sequenceIndex
    );

    return {
      nodes: [cloneElement(node, { key: sequenceIndex, children: childrenNodes })],
      count,
    };
  }

  if (node == null || typeof node === 'boolean') {
    return { nodes: [], count: 0 };
  }

  return { nodes: [node], count: 0 };
};

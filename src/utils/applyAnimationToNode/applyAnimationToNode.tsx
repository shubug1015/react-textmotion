import { cloneElement, isValidElement, ReactNode } from 'react';

import { AnimatedSpan } from '../../components/AnimatedSpan';
import { AnimationPreset, MotionConfig, SplitType } from '../../types';
import { splitText } from '../../utils/splitText';

/**
 * @description
 * `applyAnimationToNode` is a recursive pure function that traverses a React node and its children,
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
export const applyAnimationToNode = (
  node: ReactNode,
  split: SplitType,
  motion?: MotionConfig,
  preset?: AnimationPreset[],
  sequenceIndex: number = 0
): { nodes: ReactNode[]; count: number } => {
  if (typeof node === 'string' || typeof node === 'number') {
    const text = String(node);
    const splittedText = splitText(text, split);

    const animatedNode = (
      <AnimatedSpan
        key={sequenceIndex}
        splittedText={splittedText}
        motion={motion}
        preset={preset}
        sequenceIndex={sequenceIndex}
      />
    );

    return { nodes: [animatedNode], count: splittedText.length };
  }

  if (Array.isArray(node)) {
    const collected: ReactNode[] = [];
    let total = 0;

    node.forEach(child => {
      const { nodes, count } = applyAnimationToNode(child, split, motion, preset, sequenceIndex + total);

      collected.push(...nodes);
      total += count;
    });

    return { nodes: collected, count: total };
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    const { nodes, count } = applyAnimationToNode(node.props.children, split, motion, preset, sequenceIndex);

    return {
      nodes: [
        cloneElement(node, {
          key: sequenceIndex,
          children: nodes,
        }),
      ],
      count,
    };
  }

  if (node === null || typeof node === 'undefined' || typeof node === 'boolean') {
    return { nodes: [], count: 0 };
  }

  return { nodes: [node], count: 0 };
};

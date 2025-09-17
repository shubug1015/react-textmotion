import { Children, ReactNode, useMemo } from 'react';

import { AnimationPreset, MotionConfig, SplitType } from '../../types';

import { animateNode } from './animateNode';

/**
 * @description
 * `useAnimatedNode` is a custom hook that traverses through the children of a component,
 * applying animations to them based on the provided motion configuration.
 * It manages the animation sequence index to apply delays correctly.
 *
 * @param {ReactNode} children - The React children to be animated.
 * @param {SplitType} split - The split type for text animations (`character` or `word`).
 * @param {number} [initialDelay=0] - The initial delay before the animation starts, in seconds. Defaults to `0`.
 * @param {MotionConfig} motion - The motion configuration object, which is a result of merging custom motion and presets.
 * @param {AnimationPreset[]} preset - The animation presets to apply.
 *
 * @returns {ReactNode[]} An array of animated React nodes.
 */
export const useAnimatedNode = (
  children: ReactNode,
  split: SplitType,
  initialDelay: number,
  motion?: MotionConfig,
  preset?: AnimationPreset[]
) => {
  const animatedNode = useMemo(() => {
    let sequenceIndex = 0;
    const collectedNodes: ReactNode[] = [];

    Children.forEach(children, child => {
      const { nodes, count } = animateNode(child, split, initialDelay, motion, preset, sequenceIndex);

      collectedNodes.push(...nodes);
      sequenceIndex += count;
    });

    return collectedNodes;
  }, [children, split, initialDelay, motion, preset]);

  return animatedNode;
};

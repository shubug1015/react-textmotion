import { Children, ReactNode, useMemo } from 'react';

import { AnimationPreset, MotionConfig, SplitType } from '../../types';
import { applyAnimationToNode } from '../../utils/applyAnimationToNode';

/**
 * @description
 * `useAnimatedChildren` is a custom hook that traverses through the children of a component,
 * applying animations to them based on the provided motion configuration.
 * It manages the animation sequence index to apply delays correctly.
 *
 * @param {ReactNode} children - The React children to be animated.
 * @param {SplitType} split - The split type for text animations (`character` or `word`).
 * @param {MotionConfig} motion - The motion configuration object, which is a result of merging custom motion and presets.
 * @param {AnimationPreset[]} preset - The animation presets to apply.
 *
 * @returns {ReactNode[]} An array of animated React nodes.
 */
export const useAnimatedChildren = (
  children: ReactNode,
  split: SplitType,
  motion?: MotionConfig,
  preset?: AnimationPreset[]
) => {
  const animatedChildren = useMemo(() => {
    let sequenceIndex = 0;
    const collectedChildren: ReactNode[] = [];

    Children.forEach(children, child => {
      const { nodes, count } = applyAnimationToNode(child, split, motion, preset, sequenceIndex);

      collectedChildren.push(...nodes);
      sequenceIndex += count;
    });

    return collectedChildren;
  }, [children, split, motion, preset]);

  return animatedChildren;
};

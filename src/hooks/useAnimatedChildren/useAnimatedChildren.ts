import { Children, ReactNode, useMemo } from 'react';

import { MotionConfig, SplitType } from '../../types';
import { applyAnimationToNode } from '../../utils/applyAnimationToNode';

/**
 * @description
 * `useAnimatedChildren` is a custom hook that traverses through the children of a component,
 * applying animations to them based on the provided motion configuration.
 * It manages the animation sequence index to apply delays correctly.
 *
 * @param {ReactNode} children - The React children to be animated.
 * @param {MotionConfig} mergedMotion - The motion configuration object, which is a result of merging custom motion and presets.
 * @param {SplitType} split - The split type for text animations (`character` or `word`).
 *
 * @returns {ReactNode[]} An array of animated React nodes.
 */
export const useAnimatedChildren = (children: ReactNode, mergedMotion: MotionConfig, split: SplitType) => {
  const animatedChildren = useMemo(() => {
    let sequenceIndex = 0;
    const collectedChildren: ReactNode[] = [];

    Children.forEach(children, child => {
      const { nodes, nextSequenceIndex } = applyAnimationToNode(child, mergedMotion, split, sequenceIndex);

      collectedChildren.push(...nodes);
      sequenceIndex = nextSequenceIndex;
    });

    return collectedChildren;
  }, [children, mergedMotion, split]);

  return animatedChildren;
};

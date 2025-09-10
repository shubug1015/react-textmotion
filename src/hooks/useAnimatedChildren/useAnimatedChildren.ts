import { Children, ReactNode, useMemo, useRef } from 'react';

import { MotionConfig, SplitType } from '../../types';
import { applyAnimationToNode } from '../../utils';

/**
 * @description
 * `useAnimatedChildren` is a custom hook that traverses through the children of a component,
 * applying animations to them based on the provided motion configuration.
 * It keeps track of the animation sequence and applies delays accordingly.
 *
 * @param {ReactNode} children - The React children to be animated.
 * @param {MotionConfig} mergedMotion - The motion configuration object, which is a result of merging custom motion and presets.
 * @param {SplitType} split - The split type for text animations (`character`, `word`, or `line`).
 *
 * @returns {ReactNode[]} An array of animated React nodes.
 */
export const useAnimatedChildren = (children: ReactNode, mergedMotion: MotionConfig, split: SplitType) => {
  const sequenceIndexRef = useRef(0);

  const animatedChildren = useMemo(() => {
    sequenceIndexRef.current = 0;

    const collectedChildren: ReactNode[] = [];

    Children.forEach(children, child => {
      const childResult = applyAnimationToNode(child, mergedMotion, split, sequenceIndexRef);

      if (Array.isArray(childResult)) {
        collectedChildren.push(...(childResult as ReactNode[]));
      } else {
        collectedChildren.push(childResult);
      }
    });

    return collectedChildren;
  }, [children, mergedMotion, split]);

  return animatedChildren;
};

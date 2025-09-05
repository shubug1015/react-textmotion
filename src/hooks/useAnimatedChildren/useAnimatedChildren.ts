import { Children, ReactNode, useMemo, useRef } from 'react';

import { MotionConfig, SplitType } from '../../types';
import { applyAnimationToNode } from '../../utils';

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

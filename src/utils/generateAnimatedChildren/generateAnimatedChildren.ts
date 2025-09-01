import { Children, ReactNode } from 'react';

import { MotionConfig, SplitType } from '../../types';
import { applyAnimationToNode } from '../applyAnimationToNode';

export const generateAnimatedChildren = (
  children: ReactNode,
  mergedMotion: MotionConfig,
  split: SplitType,
  sequenceIndexRef: { current: number }
) => {
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
};

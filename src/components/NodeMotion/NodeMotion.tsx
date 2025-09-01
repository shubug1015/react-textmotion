import '../../styles/animations.scss';
import '../../styles/motion.scss';

import { Children, ElementType, FC, ReactNode, useMemo, useRef } from 'react';

import { MotionConfig, SplitType } from '../../types';
import { applyAnimationToNode, getTextFromReactNode, mergeMotion } from '../../utils';

type NodeMotionProps = {
  as?: ElementType;
  children: ReactNode;
  split?: SplitType;
  motion?: MotionConfig;
};

export const NodeMotion: FC<NodeMotionProps> = ({ as: Tag = 'span', children, split = 'character', motion }) => {
  const accessibleText = useMemo(() => getTextFromReactNode(children), [children]);
  const mergedMotion = useMemo(() => mergeMotion(motion), [motion]);

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

  return (
    <Tag className="motion" aria-label={accessibleText}>
      {Children.toArray(animatedChildren)}
    </Tag>
  );
};

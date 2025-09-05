import '../../styles/animations.scss';
import '../../styles/motion.scss';

import { Children, ElementType, FC, ReactNode, useMemo, useRef } from 'react';

import { useMergeMotion } from '../../hooks';
import { AnimationPreset, MotionConfig, SplitType } from '../../types';
import { generateAnimatedChildren, getTextFromReactNode } from '../../utils';

type BaseNodeMotionProps = {
  as?: ElementType;
  children: ReactNode;
  split?: SplitType;
};

type MotionProps =
  | { motion: MotionConfig; preset?: never }
  | { motion?: never; preset: AnimationPreset[] }
  | { motion?: undefined; preset?: undefined };

type NodeMotionProps = BaseNodeMotionProps & MotionProps;

export const NodeMotion: FC<NodeMotionProps> = ({
  as: Tag = 'span',
  children,
  split = 'character',
  motion,
  preset,
}) => {
  const accessibleText = useMemo(() => getTextFromReactNode(children), [children]);
  const mergedMotion = useMergeMotion(motion, preset);

  const sequenceIndexRef = useRef(0);

  const animatedChildren = useMemo(
    () => generateAnimatedChildren(children, mergedMotion, split, sequenceIndexRef),
    [children, mergedMotion, split]
  );

  return (
    <Tag className="motion" aria-label={accessibleText}>
      {Children.toArray(animatedChildren)}
    </Tag>
  );
};

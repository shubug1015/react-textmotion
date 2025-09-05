import '../../styles/animations.scss';
import '../../styles/motion.scss';

import { Children, ElementType, FC, ReactNode } from 'react';

import { useGenerateAnimatedChildren, useGetTextFromReactNode, useMergeMotion } from '../../hooks';
import { AnimationPreset, MotionConfig, SplitType } from '../../types';

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
  const accessibleText = useGetTextFromReactNode(children);
  const mergedMotion = useMergeMotion(motion, preset);
  const animatedChildren = useGenerateAnimatedChildren(children, mergedMotion, split);

  return (
    <Tag className="motion" aria-label={accessibleText}>
      {Children.toArray(animatedChildren)}
    </Tag>
  );
};

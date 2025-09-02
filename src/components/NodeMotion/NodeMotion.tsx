import '../../styles/animations.scss';
import '../../styles/motion.scss';

import { Children, ElementType, FC, ReactNode, useMemo, useRef } from 'react';

import { MotionConfig, PresetConfig, SplitType } from '../../types';
import { generateAnimatedChildren, getTextFromReactNode, mergeMotion } from '../../utils';

type BaseNodeMotionProps = {
  as?: ElementType;
  children: ReactNode;
  split?: SplitType;
};

type MotionProps =
  | { motion: MotionConfig; preset?: never }
  | { motion?: never; preset: PresetConfig }
  | { motion?: undefined; preset?: undefined };

type NodeMotionProps = BaseNodeMotionProps & MotionProps;

export const NodeMotion: FC<NodeMotionProps> = ({ as: Tag = 'span', children, split = 'character', motion }) => {
  const accessibleText = useMemo(() => getTextFromReactNode(children), [children]);
  const mergedMotion = useMemo(() => mergeMotion(motion), [motion]);

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

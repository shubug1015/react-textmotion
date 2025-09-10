import { ElementType, ReactNode } from 'react';

import { MotionConfig, SplitType } from './common';
import { AnimationPreset } from './preset';

// TextMotion
export type BaseTextMotionProps = {
  as?: ElementType;
  text: string;
  split?: SplitType;
};

export type MotionProps =
  | { motion: MotionConfig; preset?: never }
  | { motion?: never; preset: AnimationPreset[] }
  | { motion?: undefined; preset?: undefined };

export type TextMotionProps = BaseTextMotionProps & MotionProps;

// NodeMotion
export type BaseNodeMotionProps = {
  as?: ElementType;
  children: ReactNode;
  split?: Exclude<SplitType, 'line'>;
};

export type NodeMotionProps = BaseNodeMotionProps & MotionProps;

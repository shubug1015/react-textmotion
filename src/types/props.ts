import { ElementType, ReactNode } from 'react';

import { MotionConfig, SplitType } from './common';
import { AnimationPreset } from './preset';

export type BaseMotionProps = {
  as?: ElementType;
  split?: SplitType;
  trigger?: 'on-load' | 'scroll';
  repeat?: boolean;
};

export type MotionProps =
  | { motion: MotionConfig; preset?: never }
  | { motion?: never; preset: AnimationPreset[] }
  | { motion?: undefined; preset?: undefined };

// TextMotion
export type TextMotionProps = BaseMotionProps & MotionProps & { text: string };

// NodeMotion
export type NodeMotionProps = BaseMotionProps & MotionProps & { children: ReactNode };

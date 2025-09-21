import { ElementType, ReactNode } from 'react';

import { AnimationOrder, Motion, Preset, Split } from './common';

export type BaseMotionProps = {
  as?: ElementType;
  split?: Split;
  trigger?: 'on-load' | 'scroll';
  repeat?: boolean;
  initialDelay?: number;
  animationOrder?: AnimationOrder;
};

export type MotionPresetProps =
  | { motion: Motion; preset?: never }
  | { motion?: never; preset: Preset[] }
  | { motion?: undefined; preset?: undefined };

// TextMotion
export type TextMotionProps = BaseMotionProps & MotionPresetProps & { text: string };

// NodeMotion
export type NodeMotionProps = BaseMotionProps & MotionPresetProps & { children: ReactNode };

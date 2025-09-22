import type { ElementType, ReactNode } from 'react';

import type { AnimationOrder, Motion, Preset, Split, Trigger } from './common';

export type BaseMotionProps = {
  as?: ElementType;
  split?: Split;
  trigger?: Trigger;
  repeat?: boolean;
  initialDelay?: number;
  animationOrder?: AnimationOrder;
  onAnimationStart?: () => void;
};

export type MotionPresetProps =
  | { motion: Motion; preset?: never }
  | { motion?: never; preset: Preset[] }
  | { motion?: undefined; preset?: undefined };

// TextMotion
export type TextMotionProps = BaseMotionProps & MotionPresetProps & { text: string };

// NodeMotion
export type NodeMotionProps = BaseMotionProps & MotionPresetProps & { children: ReactNode };

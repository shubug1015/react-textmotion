import { AnimationPreset, MotionConfig } from '../../types';

export const DURATION = 0.25;
export const DELAY = 0.025;

export const motionMap: Record<AnimationPreset, MotionConfig> = {
  'fade-in': { fade: { variant: 'in', duration: DURATION, delay: DELAY } },
  'fade-out': { fade: { variant: 'out', duration: DURATION, delay: DELAY } },
  'slide-up': { slide: { variant: 'up', duration: DURATION, delay: DELAY } },
  'slide-down': { slide: { variant: 'down', duration: DURATION, delay: DELAY } },
  'slide-left': { slide: { variant: 'left', duration: DURATION, delay: DELAY } },
  'slide-right': { slide: { variant: 'right', duration: DURATION, delay: DELAY } },
  'scale-in': { scale: { variant: 'in', duration: DURATION, delay: DELAY } },
  'scale-out': { scale: { variant: 'out', duration: DURATION, delay: DELAY } },
  'rotate-in': { rotate: { variant: 'clockwise', duration: DURATION, delay: DELAY } },
  'rotate-out': { rotate: { variant: 'counterclockwise', duration: DURATION, delay: DELAY } },
  'bounce-in': { bounce: { variant: 'in', duration: DURATION, delay: DELAY } },
  'bounce-out': { bounce: { variant: 'out', duration: DURATION, delay: DELAY } },
  'elastic-in': { elastic: { variant: 'in', duration: DURATION, delay: DELAY } },
  'elastic-out': { elastic: { variant: 'out', duration: DURATION, delay: DELAY } },
  'flip-in': { flip: { variant: 'in', duration: DURATION, delay: DELAY } },
  'flip-out': { flip: { variant: 'out', duration: DURATION, delay: DELAY } },
};

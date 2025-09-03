import { AnimationPreset, MotionConfig, PresetConfig } from '../../types';

export const duration = 0.25;
export const delay = 0.025;

const presetToMotionMap: Record<AnimationPreset, MotionConfig> = {
  'fade-in': { fade: { variant: 'in', duration, delay } },
  'fade-out': { fade: { variant: 'out', duration, delay } },
  'slide-up': { slide: { variant: 'up', duration, delay } },
  'slide-down': { slide: { variant: 'down', duration, delay } },
  'slide-left': { slide: { variant: 'left', duration, delay } },
  'slide-right': { slide: { variant: 'right', duration, delay } },
  'scale-in': { scale: { variant: 'in', duration, delay } },
  'scale-out': { scale: { variant: 'out', duration, delay } },
  'rotate-in': { rotate: { variant: 'clockwise', duration, delay } },
  'rotate-out': { rotate: { variant: 'counterclockwise', duration, delay } },
  'bounce-in': { bounce: { variant: 'in', duration, delay } },
  'bounce-out': { bounce: { variant: 'out', duration, delay } },
  'elastic-in': { elastic: { variant: 'in', duration, delay } },
  'elastic-out': { elastic: { variant: 'out', duration, delay } },
  'flip-in': { flip: { variant: 'in', duration, delay } },
  'flip-out': { flip: { variant: 'out', duration, delay } },
};

export const getMotionFromPreset = (preset: PresetConfig): MotionConfig => {
  const motion = {};

  preset.forEach(preset => {
    Object.assign(motion, presetToMotionMap[preset]);
  });

  return motion;
};

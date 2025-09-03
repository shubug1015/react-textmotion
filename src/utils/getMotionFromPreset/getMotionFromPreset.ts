import { AnimationPreset, MotionConfig, PresetConfig } from '../../types';

const presetToMotionMap: Record<AnimationPreset, MotionConfig> = {
  'fade-in': { fade: { variant: 'in', duration: 0.25, delay: 0.025 } },
  'fade-out': { fade: { variant: 'out', duration: 0.25, delay: 0.025 } },
  'slide-up': { slide: { variant: 'up', duration: 0.25, delay: 0.025 } },
  'slide-down': { slide: { variant: 'down', duration: 0.25, delay: 0.025 } },
  'slide-left': { slide: { variant: 'left', duration: 0.25, delay: 0.025 } },
  'slide-right': { slide: { variant: 'right', duration: 0.25, delay: 0.025 } },
  'scale-in': { scale: { variant: 'in', duration: 0.25, delay: 0.025 } },
  'scale-out': { scale: { variant: 'out', duration: 0.25, delay: 0.025 } },
  'rotate-in': { rotate: { variant: 'clockwise', duration: 0.25, delay: 0.025 } },
  'rotate-out': { rotate: { variant: 'counterclockwise', duration: 0.25, delay: 0.025 } },
  'bounce-in': { bounce: { variant: 'in', duration: 0.25, delay: 0.025 } },
  'bounce-out': { bounce: { variant: 'out', duration: 0.25, delay: 0.025 } },
  'elastic-in': { elastic: { variant: 'in', duration: 0.25, delay: 0.025 } },
  'elastic-out': { elastic: { variant: 'out', duration: 0.25, delay: 0.025 } },
  'flip-in': { flip: { variant: 'in', duration: 0.25, delay: 0.025 } },
  'flip-out': { flip: { variant: 'out', duration: 0.25, delay: 0.025 } },
};

export const getMotionFromPreset = (presetConfig: PresetConfig): MotionConfig => {
  const { preset, duration, delay } = presetConfig;

  const baseMotion = presetToMotionMap[preset];
  const finalMotion: MotionConfig = JSON.parse(JSON.stringify(baseMotion));

  Object.values(finalMotion).forEach(animation => {
    if (duration !== undefined) {
      animation!.duration = duration;
    }

    if (delay !== undefined) {
      animation!.delay = delay;
    }
  });

  return finalMotion;
};

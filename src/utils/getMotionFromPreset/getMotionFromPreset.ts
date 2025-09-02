import { AnimationPreset, MotionConfig, PresetConfig } from '../../types';

const presetToMotionMap: Record<AnimationPreset, MotionConfig> = {
  fadeIn: { fade: { variant: 'in', duration: 0.25, delay: 0.025 } },
  fadeOut: { fade: { variant: 'out', duration: 0.25, delay: 0.025 } },
  slideUp: { slide: { variant: 'up', duration: 0.25, delay: 0.025 } },
  slideDown: { slide: { variant: 'down', duration: 0.25, delay: 0.025 } },
  slideLeft: { slide: { variant: 'left', duration: 0.25, delay: 0.025 } },
  slideRight: { slide: { variant: 'right', duration: 0.25, delay: 0.025 } },
  scaleIn: { scale: { variant: 'in', duration: 0.25, delay: 0.025 } },
  scaleOut: { scale: { variant: 'out', duration: 0.25, delay: 0.025 } },
  rotateIn: { rotate: { variant: 'clockwise', duration: 0.25, delay: 0.025 } },
  rotateOut: { rotate: { variant: 'counterclockwise', duration: 0.25, delay: 0.025 } },
  bounceIn: { bounce: { variant: 'in', duration: 0.25, delay: 0.025 } },
  bounceOut: { bounce: { variant: 'out', duration: 0.25, delay: 0.025 } },
  elasticIn: { elastic: { variant: 'in', duration: 0.25, delay: 0.025 } },
  elasticOut: { elastic: { variant: 'out', duration: 0.25, delay: 0.025 } },
  flipIn: { flip: { variant: 'in', duration: 0.25, delay: 0.025 } },
  flipOut: { flip: { variant: 'out', duration: 0.25, delay: 0.025 } },
};

export const getMotionFromPreset = (presetConfig: PresetConfig): MotionConfig => {
  const { preset, duration, delay, customizations } = presetConfig;

  const baseMotion = presetToMotionMap[preset];
  const finalMotion: MotionConfig = JSON.parse(JSON.stringify(baseMotion));

  for (const key in finalMotion) {
    const animation = finalMotion[key];

    if (animation !== null && typeof animation === 'object') {
      if (duration !== undefined) {
        animation.duration = duration;
      }

      if (delay !== undefined) {
        animation.delay = delay;
      }
    }
  }

  if (customizations !== null && typeof customizations === 'object') {
    for (const key in customizations) {
      const customAnimation = customizations[key];

      if (customAnimation !== null && typeof customAnimation === 'object') {
        const baseAnimation = finalMotion[key] || {};

        finalMotion[key] = { ...baseAnimation, ...customAnimation };
      }
    }
  }

  console.log(finalMotion);

  return finalMotion;
};

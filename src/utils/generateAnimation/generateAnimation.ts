import { MotionConfig } from '../../types';

export const generateAnimation = (motionConfig: MotionConfig, index: number) =>
  (Object.keys(motionConfig) as (keyof MotionConfig)[])
    .filter((animationName): animationName is keyof MotionConfig => {
      const animation = motionConfig[animationName];
      return animation !== undefined && 'variant' in animation;
    })
    .map(animationName => {
      const animation = motionConfig[animationName]!;
      if ('variant' in animation) {
        const { variant, duration, delay } = animation;
        return `${animationName}-${variant} ${duration}s ease-out ${index * delay}s both`;
      }
      return '';
    })
    .filter(Boolean)
    .join(', ');

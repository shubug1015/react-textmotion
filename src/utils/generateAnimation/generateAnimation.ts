import { MotionConfig } from '../../types';

export const generateAnimation = (motionConfig: MotionConfig, index: number): string => {
  const animations: string[] = [];

  for (const name in motionConfig) {
    if (Object.prototype.hasOwnProperty.call(motionConfig, name)) {
      const animation = motionConfig[name as keyof MotionConfig];

      if (animation && 'variant' in animation) {
        const { variant, duration, delay } = animation;
        const calculatedDelay = index * delay;
        const animationString = `${name}-${variant} ${duration}s ease-out ${calculatedDelay}s both`;

        animations.push(animationString);
      }
    }
  }

  return animations.join(', ');
};

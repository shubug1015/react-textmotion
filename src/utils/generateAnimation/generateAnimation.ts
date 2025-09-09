import { CSSProperties } from 'react';

import { MotionConfig } from '../../types';

type StyleWithCustomProperties = CSSProperties & {
  [key: `--${string}`]: string | number;
};

export const generateAnimation = (motionConfig: MotionConfig, index: number): { style: StyleWithCustomProperties } => {
  const animations: string[] = [];
  const style: StyleWithCustomProperties = {};

  for (const name in motionConfig) {
    if (Object.prototype.hasOwnProperty.call(motionConfig, name)) {
      const animation = motionConfig[name as keyof MotionConfig];

      if (animation && 'variant' in animation) {
        const { variant, duration, delay, easing, ...rest } = animation;
        const calculatedDelay = index * delay;
        const timingFunction = easing || 'ease-out';
        const animationString = `${name}-${variant} ${duration}s ${timingFunction} ${calculatedDelay}s both`;

        animations.push(animationString);

        for (const key in rest) {
          if (Object.prototype.hasOwnProperty.call(rest, key)) {
            const value = rest[key as keyof typeof rest];

            if (value !== undefined) {
              style[`--${name}-${key}`] = value as string | number;
            }
          }
        }
      }
    }
  }

  return { style: { animation: animations.join(', '), ...style } };
};

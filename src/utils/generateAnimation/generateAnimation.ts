import { CSSProperties } from 'react';

import { MotionConfig } from '../../types';

type StyleWithCustomProperties = CSSProperties & {
  [key: `--${string}`]: string | number;
};

/**
 * @description
 * `generateAnimation` is a utility function that generates CSS animation styles from a motion configuration object.
 * It creates the `animation` property and any custom CSS properties needed for the animations.
 *
 * @param {MotionConfig} motionConfig - The motion configuration object.
 * @param {number} index - The index of the element in the animation sequence, used to calculate the animation delay.
 *
 * @returns {{ style: StyleWithCustomProperties }} An object containing the generated CSS styles.
 */
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
          const value = rest[key as keyof typeof rest];

          if (value !== undefined) {
            style[`--${name}-${key}`] = value as string | number;
          }
        }
      }
    }
  }

  return { style: { animation: animations.join(', '), ...style } };
};

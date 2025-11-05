import { type CSSProperties } from 'react';

import type { CustomAnimation, Motion } from '../../types';

export type StyleWithCustomProperties = CSSProperties & {
  [key: `--${string}`]: string | number;
};

/**
 * @description
 * `generateAnimation` is a utility function that generates CSS animation styles from a motion configuration object.
 * It creates the `animation` property and any custom CSS properties needed for the animations.
 *
 * @param {Motion} motionConfig - The motion configuration object.
 * @param {number} sequenceIndex - The index of the element in the animation sequence, used to calculate the animation delay.
 * @param {number} [initialDelay=0] - The initial delay before the animation starts, in seconds. Defaults to `0`.
 *
 * @returns {{ style: StyleWithCustomProperties }} An object containing the generated CSS styles.
 */
export const generateAnimation = (
  motionConfig: Motion,
  sequenceIndex: number,
  initialDelay: number
): { style: StyleWithCustomProperties } => {
  const { animations, style } = Object.entries(motionConfig).reduce(
    (acc, [name, config]) => {
      if (config === undefined || config === null) return acc;

      if (name === 'custom') {
        const { name: animationName, duration, delay, easing = 'ease-out' } = config as CustomAnimation;
        const calculatedDelay = sequenceIndex * delay + initialDelay;

        const animationString = `${animationName} ${duration}s ${easing} ${calculatedDelay}s both`;
        acc.animations.push(animationString);
      } else if ('variant' in config) {
        const { variant, duration, delay, easing = 'ease-out', ...rest } = config;
        const calculatedDelay = sequenceIndex * delay + initialDelay;

        const animationString = `${name}-${variant} ${duration}s ${easing} ${calculatedDelay}s both`;
        acc.animations.push(animationString);

        const customProps = Object.entries(rest).reduce<StyleWithCustomProperties>((styleAcc, [key, value]) => {
          if (value !== undefined && value !== null) {
            styleAcc[`--${name}-${key}`] = value as string | number;
          }
          return styleAcc;
        }, {});

        acc.style = { ...acc.style, ...customProps };
      }

      return acc;
    },
    { animations: [] as string[], style: {} as StyleWithCustomProperties }
  );

  return { style: { animation: animations.join(', '), ...style } };
};

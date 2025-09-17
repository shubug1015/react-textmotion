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
export const generateAnimation = (
  motionConfig: MotionConfig,
  index: number,
  initialDelay: number
): { style: StyleWithCustomProperties } => {
  const { animations, style } = Object.entries(motionConfig).reduce(
    (acc, [name, animation]) => {
      if (!animation || !('variant' in animation)) return acc;

      const { variant, duration, delay, easing = 'ease-out', ...rest } = animation;
      const calculatedDelay = index * delay + initialDelay;

      const animationString = `${name}-${variant} ${duration}s ${easing} ${calculatedDelay}s both`;
      acc.animations.push(animationString);

      const customProps = Object.entries(rest).reduce<StyleWithCustomProperties>((styleAcc, [key, value]) => {
        if (value !== undefined && value !== null) {
          styleAcc[`--${name}-${key}`] = value as string | number;
        }
        return styleAcc;
      }, {});

      acc.style = { ...acc.style, ...customProps };

      return acc;
    },
    { animations: [] as string[], style: {} as StyleWithCustomProperties }
  );

  return { style: { animation: animations.join(', '), ...style } };
};

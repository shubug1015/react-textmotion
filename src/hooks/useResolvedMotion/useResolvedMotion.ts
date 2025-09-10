import { useMemo } from 'react';

import { AnimationPreset, MotionConfig } from '../../types';

import { motionMap } from './motionMap';

/**
 * @description
 * `useResolvedMotion` is a custom hook that resolves the motion configuration.
 * It either uses the provided `motion` object or generates a configuration from the `preset` array.
 * If a `preset` is provided, it will be mapped to a `MotionConfig` object.
 * If a `motion` object is provided, it will be deep-copied.
 * If neither is provided, an empty object will be returned.
 *
 * @param {MotionConfig} [motion] - A custom motion configuration object.
 * @param {AnimationPreset[]} [preset] - An array of animation presets.
 *
 * @returns {MotionConfig} The resolved motion configuration object.
 */
export const useResolvedMotion = (motion?: MotionConfig, preset?: AnimationPreset[]): MotionConfig => {
  const resolvedMotion = useMemo(() => {
    if (preset) {
      return preset.reduce((config, presetName) => ({ ...config, ...motionMap[presetName] }), {});
    }

    if (motion && Object.keys(motion).length > 0) {
      return JSON.parse(JSON.stringify(motion));
    }

    return {};
  }, [motion, preset]);

  return resolvedMotion;
};

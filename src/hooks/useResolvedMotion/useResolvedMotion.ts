import { useMemo } from 'react';

import { Motion, Preset } from '../../types';

import { motionMap } from './motionMap';

/**
 * @description
 * `useResolvedMotion` is a custom hook that resolves the motion configuration.
 * It either uses the provided `motion` object or generates a configuration from the `preset` array.
 * If a `preset` is provided, it will be mapped to a `Motion` object.
 * If a `motion` object is provided, it will be deep-copied.
 * If neither is provided, an empty object will be returned.
 *
 * @param {Motion} [motion] - A custom motion configuration object.
 * @param {Preset[]} [preset] - An array of animation presets.
 *
 * @returns {Motion} The resolved motion configuration object.
 */
export const useResolvedMotion = (motion?: Motion, preset?: Preset[]): Motion => {
  const resolvedMotion = useMemo(() => {
    if (preset) {
      return preset.reduce((config, presetName) => ({ ...config, ...motionMap[presetName] }), {});
    }

    if (motion && Object.keys(motion).length > 0) {
      return motion;
    }

    return {};
  }, [motion, preset]);

  return resolvedMotion;
};

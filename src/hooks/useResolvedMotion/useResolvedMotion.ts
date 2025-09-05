import { useMemo } from 'react';

import { AnimationPreset, MotionConfig } from '../../types';

import { motionMap } from './motionMap';

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

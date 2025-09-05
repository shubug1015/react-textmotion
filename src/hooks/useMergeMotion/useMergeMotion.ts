import { useMemo } from 'react';

import { AnimationPreset, MotionConfig } from '../../types';
import { getMotionFromPreset } from '../../utils';

export const useMergeMotion = (motion?: MotionConfig, preset?: AnimationPreset[]): MotionConfig => {
  const mergedMotion = useMemo(() => {
    if (preset) {
      return getMotionFromPreset(preset);
    }

    if (motion && Object.keys(motion).length > 0) {
      return JSON.parse(JSON.stringify(motion));
    }

    return {};
  }, [motion, preset]);

  return mergedMotion;
};

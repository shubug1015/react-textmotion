import { AnimationPreset, MotionConfig } from '../../types';
import { getMotionFromPreset } from '../getMotionFromPreset';

export const mergeMotion = (motion?: MotionConfig, preset?: AnimationPreset[]): MotionConfig => {
  if (preset) {
    return getMotionFromPreset(preset);
  }

  if (motion && Object.keys(motion).length > 0) {
    return JSON.parse(JSON.stringify(motion));
  }

  return {};
};

import { MotionConfig } from '../../types';

export const mergeMotion = (motion?: MotionConfig) => {
  if (motion && Object.keys(motion).length) return motion;
  return {};
};

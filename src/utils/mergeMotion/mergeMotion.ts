import { MotionConfig } from '../../components/TextMotion/TextMotion';

export const mergeMotion = (motion?: MotionConfig) => {
  if (motion && Object.keys(motion).length) return motion;
  return {};
};

import { MotionType } from '../../components/TextMotion/TextMotion';

export const mergeMotion = (motion?: MotionType) => {
  if (motion && Object.keys(motion).length) return motion;
  return {};
};

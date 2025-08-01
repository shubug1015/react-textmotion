import { MotionType, PresetType } from '../../components/TextMotion/TextMotion';

export const generateAnimation = (motions: MotionType, index: number) =>
  (Object.keys(motions) as PresetType[])
    .map(name => {
      const { preset, duration, delay } = motions[name]!;
      return `${name}-${preset} ${duration}s ease-out ${index * delay}s both`;
    })
    .join(', ');

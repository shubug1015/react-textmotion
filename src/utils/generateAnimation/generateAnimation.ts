import { MotionConfig, VariantType } from '../../types';

export const generateAnimation = (motions: MotionConfig, index: number) =>
  (Object.keys(motions) as VariantType[])
    .map(name => {
      const { variant, duration, delay } = motions[name]!;
      return `${name}-${variant} ${duration}s ease-out ${index * delay}s both`;
    })
    .join(', ');

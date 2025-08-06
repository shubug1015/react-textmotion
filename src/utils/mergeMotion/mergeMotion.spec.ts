import { MotionConfig } from '../../types';

import { mergeMotion } from './mergeMotion';

describe('mergeMotion', () => {
  it('returns empty object when motion is undefined', () => {
    const result = mergeMotion(undefined);

    expect(result).toEqual({});
  });

  it('returns empty object when motion has no keys', () => {
    const motions: MotionConfig = {};
    const result = mergeMotion(motions);

    expect(result).toEqual({});
  });

  it('returns same motion object when motion has keys', () => {
    const motion: MotionConfig = { fade: { variant: 'in', duration: 1, delay: 0 } };
    const result = mergeMotion(motion);

    expect(result).toBe(motion);
  });

  it('supports multiple motion types', () => {
    const motion: MotionConfig = {
      fade: { variant: 'out', duration: 1, delay: 0.5 },
      slide: { variant: 'up', duration: 2, delay: 1 },
    };
    const result = mergeMotion(motion);

    expect(result).toBe(motion);
  });
});

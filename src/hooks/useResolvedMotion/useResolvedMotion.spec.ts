import { MotionConfig } from '../../types';

import { useResolvedMotion } from './useResolvedMotion';

describe('useResolvedMotion hook', () => {
  it('returns empty object when motion is undefined', () => {
    const result = useResolvedMotion(undefined);

    expect(result).toEqual({});
  });

  it('returns empty object when motion has no keys', () => {
    const motions: MotionConfig = {};
    const result = useResolvedMotion(motions);

    expect(result).toEqual({});
  });

  it('returns same content when motion has values (deep copy)', () => {
    const motion: MotionConfig = { fade: { variant: 'in', duration: 1, delay: 0 } };
    const result = useResolvedMotion(motion);

    expect(result).toStrictEqual(motion);
    expect(result).not.toBe(motion);
  });

  it('preserves multiple motion types', () => {
    const motion: MotionConfig = {
      fade: { variant: 'out', duration: 1, delay: 0.5 },
      slide: { variant: 'up', duration: 2, delay: 1 },
    };
    const result = useResolvedMotion(motion);

    expect(result).toStrictEqual(motion);
  });

  it('returns preset-based motion when preset is provided', () => {
    const module = jest.requireActual('../getMotionFromPreset');
    const mock = jest.spyOn(module, 'getMotionFromPreset');

    mock.mockReturnValueOnce({ fade: { variant: 'in', duration: 0.25, delay: 0.025 } });

    const result = useResolvedMotion(undefined, { preset: 'fade-in' } as any);

    expect(result).toEqual({ fade: { variant: 'in', duration: 0.25, delay: 0.025 } });

    mock.mockRestore();
  });
});

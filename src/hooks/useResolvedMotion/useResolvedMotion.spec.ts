import { renderHook } from '@testing-library/react';

import type { Motion, Preset } from '../../types';

import { DELAY, DURATION } from './motionMap';
import { useResolvedMotion } from './useResolvedMotion';

describe('useResolvedMotion hook', () => {
  it('returns empty object when motion is undefined', () => {
    const { result } = renderHook(() => useResolvedMotion({}));

    expect(result.current).toEqual({});
  });

  it('returns empty object when motion has no keys', () => {
    const motion: Motion = {};
    const { result } = renderHook(() => useResolvedMotion({ motion }));

    expect(result.current).toEqual({});
  });

  it('preserves multiple motion types', () => {
    const motion: Motion = {
      fade: { variant: 'out', duration: 1, delay: 0.5 },
      slide: { variant: 'up', duration: 2, delay: 1 },
    };
    const { result } = renderHook(() => useResolvedMotion({ motion }));

    expect(result.current).toStrictEqual(motion);
  });

  it('returns preset-based motion when preset is provided', () => {
    const preset: Preset[] = ['fade-in'];
    const { result } = renderHook(() => useResolvedMotion({ preset }));

    expect(result.current).toEqual({
      fade: { variant: 'in', duration: DURATION, delay: DELAY },
    });
  });
});

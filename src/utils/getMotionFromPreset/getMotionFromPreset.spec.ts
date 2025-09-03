import { PresetConfig } from '../../types';

import { getMotionFromPreset } from './getMotionFromPreset';

describe('getMotionFromPreset', () => {
  it('should return the correct motion config for a given preset', () => {
    const presetConfig: PresetConfig = { preset: 'fade-in' };
    const result = getMotionFromPreset(presetConfig);

    expect(result).toEqual({
      fade: { variant: 'in', duration: 0.25, delay: 0.025 },
    });
  });

  it('should override the duration and delay with the provided values', () => {
    const presetConfig: PresetConfig = {
      preset: 'slide-up',
      duration: 1,
      delay: 0.5,
    };
    const result = getMotionFromPreset(presetConfig);

    expect(result).toEqual({
      slide: { variant: 'up', duration: 1, delay: 0.5 },
    });
  });

  it('should override only the duration when only duration is provided', () => {
    const presetConfig: PresetConfig = {
      preset: 'slide-up',
      duration: 1,
    };
    const result = getMotionFromPreset(presetConfig);

    expect(result).toEqual({
      slide: { variant: 'up', duration: 1, delay: 0.025 },
    });
  });

  it('should override only the delay when only delay is provided', () => {
    const presetConfig: PresetConfig = {
      preset: 'slide-up',
      delay: 0.5,
    };
    const result = getMotionFromPreset(presetConfig);

    expect(result).toEqual({
      slide: { variant: 'up', duration: 0.25, delay: 0.5 },
    });
  });

  it('should return a deep copy of the motion config', () => {
    const presetConfig: PresetConfig = { preset: 'bounce-in' };
    const result1 = getMotionFromPreset(presetConfig);
    const result2 = getMotionFromPreset(presetConfig);

    expect(result1).toEqual(result2);
    expect(result1).not.toBe(result2);
  });

  it('should handle presets with different properties correctly', () => {
    const presetConfig: PresetConfig = {
      preset: 'scale-out',
      duration: 0.8,
      delay: 0.1,
    };
    const result = getMotionFromPreset(presetConfig);

    expect(result).toEqual({
      scale: { variant: 'out', duration: 0.8, delay: 0.1 },
    });
  });

  it('should throw an error if an invalid preset is provided', () => {
    const presetConfig = { preset: 'invalid-preset' } as unknown as PresetConfig;
    expect(() => getMotionFromPreset(presetConfig)).toThrow();
  });
});

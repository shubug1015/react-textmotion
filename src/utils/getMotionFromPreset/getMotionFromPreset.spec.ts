import { PresetConfig } from '../../types';

import { delay, duration, getMotionFromPreset } from './getMotionFromPreset';

describe('getMotionFromPreset', () => {
  it('should return the correct motion config for a given single preset', () => {
    const preset: PresetConfig = ['fade-in'];
    const result = getMotionFromPreset(preset);

    expect(result).toEqual({
      fade: { variant: 'in', duration, delay },
    });
  });

  it('should return the correct motion config for a given multiple preset', () => {
    const preset: PresetConfig = ['fade-in', 'slide-up', 'scale-out'];
    const result = getMotionFromPreset(preset);

    expect(result).toEqual({
      fade: { variant: 'in', duration, delay },
      slide: { variant: 'up', duration, delay },
      scale: { variant: 'out', duration, delay },
    });
  });
});

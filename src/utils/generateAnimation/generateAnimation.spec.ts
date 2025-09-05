import { MotionConfig } from '../../types';

import { generateAnimation } from './generateAnimation';

describe('generateAnimation utility', () => {
  describe('when given a valid motion configuration', () => {
    it('should generate a single motion string correctly for index 0', () => {
      const motion: MotionConfig = {
        fade: { variant: 'in', duration: 2, delay: 1 },
      };
      const result = generateAnimation(motion, 0);

      expect(result).toBe('fade-in 2s ease-out 0s both');
    });

    it('should apply the correct staggered delay for a non-zero index', () => {
      const motion: MotionConfig = {
        fade: { variant: 'out', duration: 1.5, delay: 0.5 },
      };
      const result = generateAnimation(motion, 2);

      expect(result).toBe('fade-out 1.5s ease-out 1s both');
    });

    it('should join multiple animation strings with a comma', () => {
      const motion: MotionConfig = {
        fade: { variant: 'in', duration: 2, delay: 1 },
        slide: { variant: 'up', duration: 3, delay: 0.5 },
      };
      const result = generateAnimation(motion, 2);

      expect(result).toBe('fade-in 2s ease-out 2s both, slide-up 3s ease-out 1s both');
    });
  });

  describe('when given an invalid or empty motion configuration', () => {
    const testCases: [string, MotionConfig, string][] = [
      ['an empty motion object', {}, ''],
      [
        'a motion object with all invalid values',
        {
          fade: undefined as any,
          slide: { duration: 1, delay: 1 } as any, // missing variant
        },
        '',
      ],
      [
        'a motion object with mixed valid and invalid values',
        {
          fade: undefined as any,
          slide: { duration: 1, delay: 1 } as any,
          scale: { variant: 'in', duration: 1, delay: 1 },
        },
        'scale-in 1s ease-out 0s both',
      ],
    ];

    it.each(testCases)('should handle %s correctly', (_, motion, expected) => {
      const result = generateAnimation(motion, 0);
      expect(result).toBe(expected);
    });

    it('should ignore enumerable properties from the prototype chain', () => {
      const motionPrototype = {
        inheritedMotion: { variant: 'in', duration: 1, delay: 1 },
      };
      const motionsWithPrototype = Object.create(motionPrototype);
      motionsWithPrototype.ownMotion = { variant: 'out', duration: 2, delay: 0.5 };

      const result = generateAnimation(motionsWithPrototype, 1);

      expect(result).toBe('ownMotion-out 2s ease-out 0.5s both');
    });
  });
});
